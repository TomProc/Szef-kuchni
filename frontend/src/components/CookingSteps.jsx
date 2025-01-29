import React, { useState, useEffect } from "react";

const CookingSteps = ({ steps, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [gestureDirection, setGestureDirection] = useState(null);
  const [gestureActive, setGestureActive] = useState(false); // New state to track if gesture recognition is active

  // Start gesture recognition when button is clicked
  const startGestureRecognition = () => {
    fetch("http://localhost:5000/start_gesture_recognition", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Gesture recognition started") {
          setGestureActive(true);  // Enable gesture recognition
        }
      })
      .catch((error) => console.error("Error starting gesture recognition:", error));
  };

  // Poll the backend every second to get the current gesture direction
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:5000/get_gesture")
        .then((response) => response.json())
        .then((data) => {
          if (data.direction === "forward" && currentStep < steps.length - 1) {
            setCurrentStep((prevStep) => prevStep + 1);
          } else if (data.direction === "backward" && currentStep > 0) {
            setCurrentStep((prevStep) => prevStep - 1);
          }
        })
        .catch((error) => console.error("Error fetching gesture:", error));
    }, 1000);  // Check for gestures every second

    return () => clearInterval(interval);
  }, [currentStep, steps.length]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="cooking-steps-overlay">
      <div className="cooking-steps">
        <h2>Krok {currentStep + 1} z {steps.length}</h2>
        <p>{steps[currentStep]}</p>

        <div className="buttons">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0 || gestureActive}
          >
            ← Poprzedni
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1 || gestureActive}
          >
            Następny →
          </button>
        </div>

        <button className="close-button" onClick={onClose}>Zamknij</button>

        {/* Button to start gesture recognition */}
        <button className="start-gesture-btn" onClick={startGestureRecognition}>
          Rozpocznij rozpoznawanie gestów
        </button>
      </div>
    </div>
  );
};

export default CookingSteps;
