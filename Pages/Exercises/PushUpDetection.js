import React, { useState, useEffect, useRef } from "react";
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";
import { db, auth } from '../../firebase.js';
import { ImageBackground } from 'react-native';
import '../../App.css';

const PushUpDetection = () => {
  const [user, setUser] = useState(null);
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [angle, setAngle] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [pushUpCount, setPushUpCount] = useState(0);
  const [elbowStatus, setElbowStatus] = useState("");
  const [conditions, setConditions] = useState({
    bodyStraight: false,
    elbowsTucked: false,
    chestNearFloor: false
  });

  useEffect(() => {
    auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        setUser({
          email: currentUser.email,
          uid: currentUser.uid
        });
      } else {
        setUser(null);
      }
    });

    const initPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
          delegate: "GPU"
        },
        runningMode: "IMAGE",
        numPoses: 1
      });
      setPoseLandmarker(poseLandmarker);
    };

    initPoseLandmarker();

    return () => poseLandmarker?.close();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const drawingUtils = new DrawingUtils(ctx);

    let animationFrameId;

    const predictWebcam = async () => {
      setIsDetecting(true);
      const result = await poseLandmarker?.detect(video);
      setIsDetecting(false);

      const ctx = canvasRef.current.getContext("2d");
      const drawingUtils = new DrawingUtils(ctx);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (result && result.landmarks.length > 0) {
        result.landmarks.forEach((landmark) => {
          checkBodyStraight(landmark, ctx, drawingUtils);

          const elbowsAreTucked = checkElbowsTucked(landmark);
          const chestIsNearFloor = checkChestNearFloor(landmark);

          setConditions(prevConditions => ({
            ...prevConditions,
            bodyStraight: !showWarning,
            elbowsTucked: elbowsAreTucked,
            chestNearFloor: chestIsNearFloor
          }));

          setElbowStatus(elbowsAreTucked ? "Elbows are properly tucked" : "WARNING: Keep elbows close to body");

          if (chestIsNearFloor && elbowsAreTucked) {
            setPushUpCount(prevCount => prevCount + 1);
          }
        });
      }
      requestAnimationFrame(predictWebcam);
    };

    if (poseLandmarker && video) {
      const constraints = { video: true };
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", () => {
          predictWebcam();
        });
      });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [poseLandmarker]);

  const checkBodyStraight = (landmarks, ctx, drawingUtils) => {
    const bodyStraightnessAngle = calculateAngle(landmarks[11], landmarks[24], landmarks[23]); // using shoulder and hip points
    setAngle(bodyStraightnessAngle);
    const isBodyNotStraight = bodyStraightnessAngle > 20; // Set a threshold angle for straightness
    setShowWarning(isBodyNotStraight);
    const color = isBodyNotStraight ? "red" : "black";
    drawingUtils.drawLandmarks(landmarks, { color: color });
    drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color: color });
  };

  const checkElbowsTucked = (landmarks) => {
    const elbowAngle = calculateAngle(landmarks[11], landmarks[13], landmarks[15]); // Left arm 
    return elbowAngle < 45; // Less than 45 degrees is considered 'tucked'
  };

  const checkChestNearFloor = (landmarks) => {
    const chestY = landmarks[11].y; // Y-coordinate of the chest
    const leftHandY = landmarks[15].y; // Y-coordinate of the left wrist
    const rightHandY = landmarks[16].y; // Y-coordinate of the right wrist
  
    // Calculate the average Y-coordinate of both hands to establish a "floor" level
    const handsAverageY = (leftHandY + rightHandY) / 2;
  
    // Check if the chest Y-coordinate is at or below the average hand Y-coordinate
    return chestY >= handsAverageY;
  };

  const calculateAngle = (A, B, C) => {
    const AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    const AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(A.y - C.y, 2));
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * (180 / Math.PI);
  };

  const saveSessionData = () => {
    if (pushUpCount > 0) {
      db.collection("pushUpSessions").add({
        userEmail: user.email,
        userId: user.uid,
        pushUpCount: pushUpCount,
        elbowStatus: elbowStatus,
        bodyAngle: angle,
        conditions: conditions,
        createdAt: new Date()
      })
      .then(() => {
        console.log("Session data successfully written!");
        setPushUpCount(0); // Reset count after saving
      })
      .catch((error) => {
        console.error("Error writing session data: ", error);
      });
    } else {
      console.log("No user logged in or no push-ups counted");
    }
  };

  return (
    <ImageBackground
            source={require('../../assets/BlackBackground.png')}
            className="backgroundImage"
            resizeMode="cover"
        >
    <div className="app-container">
      <div className="video-card">
        {isDetecting && <p>Detecting landmarks...</p>}
        <video ref={videoRef} autoPlay className="video-stream" />
        <canvas ref={canvasRef} className="video-overlay" />
      </div>
      <div className="info-card">
        <p>Push-Up Count: {pushUpCount}</p>
        <p>Angle: {angle ? `${angle.toFixed(2)}°` : 'N/A'}</p>
        <p>Body Position: {showWarning ? "Body Not Straight" : "Body Straight"}</p>
        <p>Elbows: {elbowStatus}</p>
        <button onClick={saveSessionData}>Save Session</button>
      </div>
    </div>
    </ImageBackground>
  );
};

export default PushUpDetection;
