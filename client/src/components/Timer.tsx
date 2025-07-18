import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const Timer: React.FC = () => {
  const { 
    isTimerRunning, 
    timerElapsedTime, 
    timerStartTime,
    startTimer,
    pauseTimer,
    resetTimer,
    updateTimerElapsed
  } = useStore();

  useEffect(() => {
    let interval: number;
    
    if (isTimerRunning && timerStartTime) {
      interval = setInterval(() => {
        updateTimerElapsed(Date.now() - timerStartTime);
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timerStartTime, updateTimerElapsed]);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center space-y-8">
      <div className="relative">
        <div className="timer-display">
          {formatTime(timerElapsedTime)}
        </div>
        {isTimerRunning && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full pulse-animation"></div>
        )}
      </div>
      
      <div className="flex justify-center space-x-4">
        {!isTimerRunning ? (
          <button
            onClick={startTimer}
            className="btn btn-success flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Démarrer</span>
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="btn btn-warning flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Pause</span>
          </button>
        )}
        
        <button
          onClick={resetTimer}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};