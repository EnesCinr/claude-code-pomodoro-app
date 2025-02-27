import { useState, useCallback, useRef, useEffect } from 'react';
import PomodoroTimer from './components/PomodoroTimer';
import TaskList, { Task } from './components/TaskList';
import Stats, { SessionData, StatsHandle } from './components/Stats';
import './App.css';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

function App() {
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const statsRef = useRef<StatsHandle>(null);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('pomodoro-tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const handleTaskSelect = (taskId: string | null) => {
    setCurrentTaskId(taskId);
  };

  const handleTimerComplete = (mode: TimerMode) => {
    // Play sound notification when timer completes
    try {
      const audio = new Audio('/sounds/complete.mp3');
      audio.play().catch(e => console.log('Audio playback error:', e));
    } catch (error) {
      console.log('Sound playback error:', error);
    }
    
    // If it was a pomodoro session and there's a task selected,
    // increment its completed pomodoro count
    if (mode === 'pomodoro' && currentTaskId) {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === currentTaskId && task.completedPomodoros < task.estimatedPomodoros
            ? { ...task, completedPomodoros: task.completedPomodoros + 1 } 
            : task
        )
      );
    }
  };

  const handleLogSession = useCallback((duration: number, mode: TimerMode) => {
    if (statsRef.current) {
      statsRef.current.addSession(duration, mode);
    }
  }, []);

  // Task management functions
  const handleAddTask = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, task]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Pomodoro Focus</h1>
      </header>
      
      <main className="app-content">
        <div className="timer-section">
          <PomodoroTimer 
            onTimerComplete={handleTimerComplete}
            onLogSession={handleLogSession}
          />
        </div>
        
        <div className="side-panel">
          <TaskList 
            tasks={tasks}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
            onTaskSelect={handleTaskSelect}
            currentTaskId={currentTaskId}
          />
          
          <Stats 
            ref={statsRef}
            currentTaskId={currentTaskId}
          />
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Pomodoro Focus App - Get things done with time management</p>
      </footer>
    </div>
  );
}

export default App;
