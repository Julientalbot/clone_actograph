import React, { useState, useEffect } from 'react';

export const Timer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!isRunning) {
      setStartTime(Date.now() - elapsedTime);
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime(null);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-6xl font-mono font-bold text-gray-900">
        {formatTime(elapsedTime)}
      </div>
      
      <div className="flex space-x-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="btn btn-success px-6 py-3 text-lg"
          >
            ▶ Start
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="btn btn-secondary px-6 py-3 text-lg"
          >
            ⏸ Pause
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="btn btn-danger px-6 py-3 text-lg"
        >
          ⏹ Reset
        </button>
      </div>
    </div>
  );
};