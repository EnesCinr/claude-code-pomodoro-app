import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import '../styles/Stats.css';

interface SessionData {
  id: string;
  timestamp: number;
  duration: number;
  mode: 'pomodoro' | 'shortBreak' | 'longBreak';
  taskId: string | null;
}

interface StatsProps {
  currentTaskId: string | null;
}

// Create a handle type for the functions we want to expose
export interface StatsHandle {
  addSession: (duration: number, mode: 'pomodoro' | 'shortBreak' | 'longBreak') => void;
}

const Stats = forwardRef<StatsHandle, StatsProps>(({ currentTaskId }, ref) => {
  const [sessions, setSessions] = useState<SessionData[]>(() => {
    const savedSessions = localStorage.getItem('pomodoro-sessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });
  
  // Save sessions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('pomodoro-sessions', JSON.stringify(sessions));
  }, [sessions]);
  
  // Function to add a new session (exposed to parent via ref)
  const addSession = (duration: number, mode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    const newSession: SessionData = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      duration,
      mode,
      taskId: currentTaskId
    };
    
    setSessions(prevSessions => [...prevSessions, newSession]);
  };
  
  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    addSession
  }));
  
  // Calculate total focus time (in minutes)
  const totalFocusTime = sessions
    .filter(session => session.mode === 'pomodoro')
    .reduce((total, session) => total + session.duration / 60, 0);
  
  // Calculate sessions completed today
  const todaySessions = sessions.filter(session => {
    const today = new Date();
    const sessionDate = new Date(session.timestamp);
    return (
      sessionDate.getDate() === today.getDate() &&
      sessionDate.getMonth() === today.getMonth() &&
      sessionDate.getFullYear() === today.getFullYear() &&
      session.mode === 'pomodoro'
    );
  });
  
  // Format time (hours and minutes)
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours === 0) {
      return `${mins} min`;
    }
    
    return `${hours}h ${mins}m`;
  };
  
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Group sessions by date
  const groupedSessions: { [date: string]: SessionData[] } = {};
  sessions.forEach(session => {
    const dateKey = formatDate(session.timestamp);
    if (!groupedSessions[dateKey]) {
      groupedSessions[dateKey] = [];
    }
    groupedSessions[dateKey].push(session);
  });
  
  return (
    <div className="stats-container">
      <h2>Statistics</h2>
      
      <div className="stats-summary">
        <div className="stat-box">
          <span className="stat-value">{formatTime(totalFocusTime)}</span>
          <span className="stat-label">Total Focus Time</span>
        </div>
        
        <div className="stat-box">
          <span className="stat-value">{sessions.filter(s => s.mode === 'pomodoro').length}</span>
          <span className="stat-label">Total Pomodoros</span>
        </div>
        
        <div className="stat-box">
          <span className="stat-value">{todaySessions.length}</span>
          <span className="stat-label">Today's Pomodoros</span>
        </div>
      </div>
      
      <div className="sessions-history">
        <h3>Recent Sessions</h3>
        
        {Object.keys(groupedSessions).length === 0 ? (
          <p className="no-data">No sessions recorded yet.</p>
        ) : (
          <div className="history-list">
            {Object.entries(groupedSessions)
              .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
              .slice(0, 7) // Show only the last 7 days with activity
              .map(([date, dateSessions]) => (
                <div key={date} className="history-day">
                  <h4>{date}</h4>
                  <div className="session-count">
                    {dateSessions.filter(s => s.mode === 'pomodoro').length} pomodoros
                    ({formatTime(dateSessions
                      .filter(s => s.mode === 'pomodoro')
                      .reduce((total, s) => total + s.duration / 60, 0))})
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
});

export { Stats, type SessionData };
export default Stats;