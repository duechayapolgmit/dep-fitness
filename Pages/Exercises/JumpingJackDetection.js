import React, { useState, useEffect, useRef } from "react";
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";
import { db, auth } from '../../firebase.js';

const JumpingJackDetection = () => {
  const [user, setUser] = useState(null);
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [angle, setAngle] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [jumpingJackCount, setJumpingJackCount] = useState(0);
  const [feetPositionStatus, setFeetPositionStatus] = useState("");
  const [conditions, setConditions] = useState({
    armsRaised: false,
    feetApart: false
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
    let drawingUtils;

    const predictWebcam = async () => {
      if (!drawingUtils) {
        drawingUtils = new DrawingUtils(ctx);
      }

      setIsDetecting(true);
      const result = await poseLandmarker?.detect(video);
      setIsDetecting(false);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (result && result.landmarks.length > 0) {
        result.landmarks.forEach((landmark) => {
          const armsAreRaised = checkArmsRaised(landmark);
          const feetAreApart = checkFeetApart(landmark);

          setConditions(prevConditions => ({
            ...prevConditions,
            armsRaised: armsAreRaised,
            feetApart: feetAreApart
          }));

          if (armsAreRaised && feetAreApart) {
            setJumpingJackCount(prevCount => prevCount + 1);
          }

          setFeetPositionStatus(feetAreApart ? "Feet are apart" : "WARNING: Feet should be apart");

          // Drawing the landmarks and connectors
          drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, { color: 'Blue' });
          drawingUtils.drawLandmarks(landmark, { color: 'Black', radius: 4 });
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
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [poseLandmarker]);


  const checkArmsRaised = (landmarks) => {
    // Check if the hands are above the head
    const leftHandRaised = landmarks[15].y < landmarks[1].y;
    const rightHandRaised = landmarks[16].y < landmarks[1].y;
    return leftHandRaised && rightHandRaised;
  };

  const checkFeetApart = (landmarks) => {
    // Check if the feet are wider than the hips
    const hipWidth = Math.abs(landmarks[23].x - landmarks[24].x);
    const feetDistance = Math.abs(landmarks[27].x - landmarks[28].x);
    return feetDistance > hipWidth;
  };

  const saveSessionData = () => {
    if (jumpingJackCount > 0) {
      db.collection("jumpingJackSessions").add({
        userEmail: user.email,
        userId: user.uid,
        jumpingJackCount: jumpingJackCount,
        feetStatus: feetPositionStatus,
        conditions: conditions,
        createdAt: new Date()
      })
        .then(() => {
          console.log("Session data successfully written!");
          setJumpingJackCount(0); // Reset count after saving
        })
        .catch((error) => {
          console.error("Error writing session data: ", error);
        });
    } else {
      console.log("No user logged in or no jumping jacks counted");
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
        <p>Jumping Jack Count: {jumpingJackCount}</p>
        <p>Feet Position: {feetPositionStatus}</p>
        <button onClick={saveSessionData}>Save Session</button>
      </div>
    </div>
  );
};

export default JumpingJackDetection;
