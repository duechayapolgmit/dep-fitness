import React, { useState, useEffect, useRef } from "react";
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";
import { db, auth } from '../../firebase.js';

const PlankDetection = () => {
  const [user, setUser] = useState(null);
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [angle, setAngle] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [plankTime, setPlankTime] = useState(0);
  const startTimeRef = useRef(null);
  const [bodyStraight, setBodyStraight] = useState(false);

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

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (result && result.landmarks.length > 0) {
        result.landmarks.forEach((landmark) => {
          const bodyIsStraight = checkBodyStraight(landmark, ctx, drawingUtils);
          setBodyStraight(bodyIsStraight);
          if (bodyIsStraight) {
            if (!startTimeRef.current) {
              startTimeRef.current = new Date().getTime();
            }
          } else {
            if (startTimeRef.current) {
              const endTime = new Date().getTime();
              setPlankTime(plankTime + (endTime - startTimeRef.current) / 1000);
              startTimeRef.current = null;
            }
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
  }, [poseLandmarker, plankTime]);

  const checkBodyStraight = (landmarks, ctx, drawingUtils) => {
    const shoulderHipLineAngle = calculateAngle(landmarks[11], landmarks[23], landmarks[24]);
    setAngle(shoulderHipLineAngle);
    const isBodyNotStraight = shoulderHipLineAngle > 10; // Tighter threshold for straightness
    setShowWarning(isBodyNotStraight);
    const color = isBodyNotStraight ? "red" : "black";
    drawingUtils.drawLandmarks(landmarks, { color: color });
    drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color: color });
    return !isBodyNotStraight;
  };

  const calculateAngle = (A, B, C) => {
    const AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    const AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(A.y - C.y, 2));
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * (180 / Math.PI);
  };

  const saveSessionData = () => {
    if (plankTime > 0) {
      db.collection("plankSessions").add({
        userEmail: user.email,
        userId: user.uid,
        plankTime: plankTime,
        bodyAngle: angle,
        bodyStraight: bodyStraight,
        createdAt: new Date()
      })
      .then(() => {
        console.log("Session data successfully written!");
        setPlankTime(0); // Reset time after saving
      })
      .catch((error) => {
        console.error("Error writing session data: ", error);
      });
    } else {
      console.log("No user logged in or no planking detected");
    }
  };

  return (
    <div className="app-container">
      <div className="video-card">
        {isDetecting && <p>Detecting landmarks...</p>}
        <video ref={videoRef} autoPlay className="video-stream" />
        <canvas ref={canvasRef} className="video-overlay" />
      </div>
      <div className="info-card">
        <p>Plank Time: {plankTime.toFixed(2)} seconds</p>
        <p>Angle: {angle ? `${angle.toFixed(2)}°` : 'N/A'}</p>
        <p>Body Position: {showWarning ? "Body Not Straight" : "Body Straight"}</p>
        <button onClick={saveSessionData}>Save Session</button>
      </div>
    </div>
  );
};

export default PlankDetection;
