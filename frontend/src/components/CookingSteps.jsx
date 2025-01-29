import React, { useState } from "react";

const CookingSteps = ({ steps, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

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
          <button onClick={handlePrev} disabled={currentStep === 0}>← Poprzedni</button>
          <button onClick={handleNext} disabled={currentStep === steps.length - 1}>Następny →</button>
        </div>

        <button className="close-button" onClick={onClose}>Zamknij</button>
      </div>
    </div>
  );
};

export default CookingSteps;
