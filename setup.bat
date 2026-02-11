@echo off
REM AI UI Generator - Windows Setup Script

echo Setting up AI UI Generator...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo Node.js detected
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo npm is not installed. Please install npm first.
    exit /b 1
)

echo npm detected
npm --version
echo.

REM Install dependencies
echo Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies
    exit /b 1
)

echo Dependencies installed successfully
echo.

REM Check if .env exists
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo.
    echo WARNING: Please edit .env and add your GEMINI_API_KEY
    echo Get your API key from: https://makersuite.google.com/app/apikey
) else (
    echo .env file already exists
)

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Edit .env and add your GEMINI_API_KEY
echo 2. Run 'npm run dev' to start the development server
echo 3. Open http://localhost:3000 in your browser
echo.
pause
