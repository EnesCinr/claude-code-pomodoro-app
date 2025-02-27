const builder = require('electron-builder');
const path = require('path');
const fs = require('fs');

async function buildElectronApp() {
  try {
    await builder.build({
      config: {
        appId: 'com.pomodoro.app',
        productName: 'Pomodoro Focus',
        directories: {
          output: path.resolve(__dirname, '../dist'),
          app: path.resolve(__dirname, '../pomodoro-app')
        },
        files: [
          '**/*',
          '!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}',
          '!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}',
          '!**/node_modules/*.d.ts',
          '!**/node_modules/.bin',
          '!**/*.{iml,o,hprof,orig,pyc,pyo,rbc,swp,csproj,sln,xproj}',
          '!.editorconfig',
          '!**/._*',
          '!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}',
          '!**/{__pycache__,thumbs.db,.flowconfig,.idea,.vs,.nyc_output}',
          '!**/{appveyor.yml,.travis.yml,circle.yml}',
          '!**/{npm-debug.log,yarn.lock,.yarn-integrity,.yarn-metadata.json}'
        ],
        win: {
          target: ['nsis'],
          icon: path.resolve(__dirname, '../pomodoro-app/public/icon.png')
        },
        mac: {
          target: ['dmg'],
          icon: path.resolve(__dirname, '../pomodoro-app/public/icon.png')
        },
        linux: {
          target: ['AppImage'],
          icon: path.resolve(__dirname, '../pomodoro-app/public/icon.png')
        }
      }
    });
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildElectronApp();