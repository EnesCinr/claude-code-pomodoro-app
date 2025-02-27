import { useState, useEffect } from 'react';
import '../styles/PomodoroTimer.css';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface PomodoroTimerProps {
  onTimerComplete: (mode: TimerMode) => void;
  onLogSession: (duration: number, mode: TimerMode) => void;
}

const TIMER_SETTINGS = {
  pomodoro: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes in seconds
  longBreak: 15 * 60, // 15 minutes in seconds
};

export const PomodoroTimer = ({ onTimerComplete, onLogSession }: PomodoroTimerProps) => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS[mode]);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  // Reset timer when mode changes
  useEffect(() => {
    setTimeLeft(TIMER_SETTINGS[mode]);
    setIsRunning(false);
  }, [mode]);

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Timer completed
      setIsRunning(false);
      
      // Log the completed session
      onLogSession(TIMER_SETTINGS[mode], mode);
      
      // Notify parent component that timer is complete
      onTimerComplete(mode);
      
      // Auto-switch to the next mode
      if (mode === 'pomodoro') {
        const newCount = pomodoroCount + 1;
        setPomodoroCount(newCount);
        
        // After every 4 pomodoros, take a long break
        if (newCount % 4 === 0) {
          setMode('longBreak');
        } else {
          setMode('shortBreak');
        }
      } else {
        // After a break, go back to pomodoro
        setMode('pomodoro');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, pomodoroCount, onTimerComplete, onLogSession]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(TIMER_SETTINGS[mode]);
    setIsRunning(false);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
  };

  // Format seconds into MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pomodoro-timer">
      <div className="timer-display">{formatTime(timeLeft)}</div>
      
      <div className="timer-modes">
        <button 
          className={`mode-button ${mode === 'pomodoro' ? 'active' : ''}`}
          onClick={() => switchMode('pomodoro')}
        >
          Pomodoro
        </button>
        <button 
          className={`mode-button ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => switchMode('shortBreak')}
        >
          Short Break
        </button>
        <button 
          className={`mode-button ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => switchMode('longBreak')}
        >
          Long Break
        </button>
      </div>
      
      <div className="timer-controls">
        <button className="control-button" onClick={toggleTimer}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button className="control-button" onClick={resetTimer}>
          Reset
        </button>
      </div>
      
      <div className="pomodoro-count">
        Completed Pomodoros: {pomodoroCount}
      </div>
    </div>
  );
};

export default PomodoroTimer;