import React, { useState, useEffect, useRef } from "react";
import { PoseLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";
import { db, auth } from '../../firebase.js';
import { ImageBackground } from 'react-native';

const SquatDetection = () => {
  const [user, setUser] = useState(null);
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [angle, setAngle] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [squatCount, setSquatCount] = useState(0);
  const [kneeWidthStatus, setKneeWidthStatus] = useState("");
  const [lastSquatTime, setLastSquatTime] = useState(0);
  const [isInSquatPosition, setIsInSquatPosition] = useState(false);
  const [conditions, setConditions] = useState({
    headStraight: false,
    kneesShoulderWidthApart: false,
    squatDepthReached: false
  });




  //-------------------------------------------------------------------------------------------------------------------------------------

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
          checkHeadStraight(landmark, ctx, drawingUtils);

          const kneesAreShoulderWidthApart = checkKneesShoulderWidthApart(landmark);
          const squatDepthIsReached = checkSquatDepthReached(landmark);

          setConditions(prevConditions => ({
            ...prevConditions,
            kneesShoulderWidthApart: kneesAreShoulderWidthApart,
            squatDepthReached: squatDepthIsReached
          }));

          if (squatDepthIsReached) {
            setIsInSquatPosition(true);
          } else {
            setIsInSquatPosition(false);
          }

          // Update knee width status on screen
          setKneeWidthStatus(kneesAreShoulderWidthApart ? "Knees are shoulder-width apart" : "WARNING: Knees should be shoulder-width apart");

          //Squat Count
          if (!isInSquatPosition && squatDepthIsReached) {
            const currentTime = new Date().getTime();
            if (currentTime > lastSquatTime + 2000) {
              setSquatCount(prevCount => prevCount + 1);
              setLastSquatTime(currentTime);
            }
          }
        });
      }
      requestAnimationFrame(predictWebcam);
    };

    //-------------------------------------------------------------------------------------------------------------------------------------

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


  const calculateAngle = (A, B, C) => {
    const AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    const BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    const AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB)) * (180 / Math.PI);
  };

  const saveSessionData = () => {
    if (squatCount > 0) {
      db.collection("squatSessions").add({
        userEmail: user.email,
        userId: user.uid,
        squatCount: squatCount,
        kneeStatus: kneeWidthStatus,
        headAngle: angle,
        conditions: conditions,
        createdAt: new Date()
      })
        .then(() => {
          console.log("Session data successfully written!");
          setSquatCount(0); // Reset squat count after saving
        })
        .catch((error) => {
          console.error("Error writing session data: ", error);
        });
    } else {
      console.log("No user logged in or no squats counted");
    }
  };


  //-------------------------------------------------------------------------------------------------------------------------------------

  // Conditions

  const checkHeadStraight = (landmarks, ctx, drawingUtils) => {
    // Use neck and shoulder landmarks to calculate a vertical alignment
    const verticalAlignmentAngle = calculateAngle(landmarks[11], landmarks[1], landmarks[12]);

    // Update state with the calculated angle, labeled specifically as 'Head Angle'
    setAngle(verticalAlignmentAngle);

    // Determine if the alignment is within an acceptable vertical range
    // Here, an angle close to 55 degrees means the shoulders and neck are aligned in a straight line
    const isOutOfLine = verticalAlignmentAngle < 50 || verticalAlignmentAngle > 62;
    setShowWarning(isOutOfLine);

    // Determine color based on head position
    const color = isOutOfLine ? "red" : "black";

    // Drawing the landmarks and connectors
    drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color: color });
    drawingUtils.drawLandmarks(landmarks, {
      color: color,
      radius: (data) => data.from ? DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 20) : 4  // Default radius is 4 if no 'z' value, the z value makes the nodes freak out
    });
  };


  const checkKneesShoulderWidthApart = (landmarks) => {
    // Calculate distances between shoulders and knees
    const shoulderWidth = Math.sqrt(
      Math.pow(landmarks[12].x - landmarks[11].x, 2) +
      Math.pow(landmarks[12].y - landmarks[11].y, 2)
    );
    const kneeWidth = Math.sqrt(
      Math.pow(landmarks[26].x - landmarks[25].x, 2) +
      Math.pow(landmarks[26].y - landmarks[25].y, 2)
    );

    // We consider knees are shoulder-width apart if the knee width is within 90% to 110% of the shoulder width
    return kneeWidth >= 0.5 * shoulderWidth && kneeWidth <= 1.5 * shoulderWidth;
  };

  const checkSquatDepthReached = (landmarks) => {
    // First, calculate the midpoints if you're using individual left and right points
    const hipMidpointY = (landmarks[23].y + landmarks[24].y) / 2;
    const kneeMidpointY = (landmarks[25].y + landmarks[26].y) / 2;

    // Check if the hips are at or below the knees (greater y value indicates a lower position in many coordinate systems)
    return hipMidpointY >= kneeMidpointY;
  };

  //-------------------------------------------------------------------------------------------------------------------------------------

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
        <p>Squat Count: {squatCount}</p>
        <p>Angle: {angle ? `${angle.toFixed(2)}°` : 'N/A'}</p>
        <p>Head Correction: {showWarning ? "Out of Correct Angle Space" : "In Correct Angle Space"}</p>
        <p>Knees: {kneeWidthStatus}</p>
        <button onClick={saveSessionData}>Save Session</button>
      </div>
    </div>
    </ImageBackground>
  );
};



export default SquatDetection;