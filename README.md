# Pomodoro Focus App

Pomodoro Focus is a desktop application that helps you organize your work using the Pomodoro Technique, manage tasks, and track your productivity statistics.

## Features

- **Pomodoro Timer**: 25-minute work sessions followed by 5-minute short breaks, with longer 15-minute breaks after completing 4 pomodoros
- **Task Management**: Create, track and complete tasks with estimated pomodoro counts
- **Statistics**: View your productivity data, including total focus time and daily pomodoro counts
- **Cross-platform**: Works on Windows, macOS and Linux

## Technologies Used

- **React**: UI library for building the user interface
- **TypeScript**: For type-safe JavaScript code
- **Electron**: Framework for building cross-platform desktop applications
- **Vite**: Modern frontend build tool
- **CSS**: Custom styling with responsive design

## Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Development Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/pomodoro-app.git
   cd pomodoro-app
   ```

2. Install dependencies
   ```
   cd pomodoro-app
   npm install
   ```

3. Run in development mode
   ```
   npm run electron:dev
   ```

### Building for Production

To build the application for your platform:

```
npm run electron:build
```

This will create distributable packages in the `dist` directory.

## How to Use

1. **Timer**: Use the Pomodoro, Short Break, and Long Break buttons to switch between timer modes
2. **Tasks**: Add tasks with estimated pomodoro counts, check them off when complete
3. **Statistics**: View your productivity data in the Stats panel

## The Pomodoro Technique

The Pomodoro Technique is a time management method developed by Francesco Cirillo. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a "pomodoro", from the Italian word for tomato, after the tomato-shaped kitchen timer Cirillo used as a university student.

## License

MIT

## Acknowledgments

- Francesco Cirillo for creating the Pomodoro Technique
- The React and Electron communities for their excellent tools and documentation