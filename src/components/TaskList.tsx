import { useState } from 'react';
import '../styles/TaskList.css';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  estimatedPomodoros: number;
  completedPomodoros: number;
}

interface TaskListProps {
  onTaskSelect: (taskId: string | null) => void;
  currentTaskId: string | null;
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const TaskList = ({ 
  onTaskSelect, 
  currentTaskId, 
  tasks, 
  onAddTask, 
  onDeleteTask, 
  onToggleComplete 
}: TaskListProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);
  
  const addTask = () => {
    if (newTaskTitle.trim() === '') return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      estimatedPomodoros: newTaskPomodoros,
      completedPomodoros: 0
    };
    
    onAddTask(newTask);
    setNewTaskTitle('');
    setNewTaskPomodoros(1);
  };
  
  const deleteTask = (id: string) => {
    onDeleteTask(id);
    if (currentTaskId === id) {
      onTaskSelect(null);
    }
  };
  
  const toggleTaskCompletion = (id: string) => {
    onToggleComplete(id);
  };
  
  const handleTaskSelect = (id: string) => {
    onTaskSelect(id === currentTaskId ? null : id);
  };
  
  return (
    <div className="task-list">
      <h2>Tasks</h2>
      
      <div className="add-task">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task..."
          className="task-input"
        />
        <div className="pomodoro-estimate">
          <label htmlFor="pomodoro-count">Pomodoros: </label>
          <input
            id="pomodoro-count"
            type="number"
            min="1"
            max="10"
            value={newTaskPomodoros}
            onChange={(e) => setNewTaskPomodoros(parseInt(e.target.value))}
            className="pomodoro-input"
          />
        </div>
        <button onClick={addTask} className="add-button">Add Task</button>
      </div>
      
      <ul className="tasks">
        {tasks.map(task => (
          <li 
            key={task.id} 
            className={`task-item ${task.completed ? 'completed' : ''} ${task.id === currentTaskId ? 'selected' : ''}`}
          >
            <div className="task-header">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
                className="task-checkbox"
              />
              <span 
                className="task-title"
                onClick={() => handleTaskSelect(task.id)}
              >
                {task.title}
              </span>
              <button 
                onClick={() => deleteTask(task.id)}
                className="delete-button"
              >
                ×
              </button>
            </div>
            
            <div className="task-pomodoros">
              {Array.from({ length: task.estimatedPomodoros }, (_, i) => (
                <span 
                  key={i} 
                  className={`pomodoro-circle ${i < task.completedPomodoros ? 'completed' : ''}`}
                ></span>
              ))}
            </div>
          </li>
        ))}
      </ul>
      
      {tasks.length === 0 && (
        <p className="no-tasks">No tasks yet. Add one to get started!</p>
      )}
    </div>
  );
};

export default TaskList;