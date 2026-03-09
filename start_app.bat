@echo off
title Career Guidance Chatbot Launcher
echo Starting Career Guidance Chatbot...
cd /d "c:\Users\ASUS\Desktop\Capstone Project\Capstone Project - 1"

:: Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

:: Build if .next doesn't exist (optional, but good for safety)
if not exist ".next" (
    echo Building application...
    call npm run build
)

:: Start the server in a new minimized window
start "CareerBotServer" /min npm start

:: Wait for server to initialize
echo Waiting for server to start...
timeout /t 5 >nul

:: Open Browser
start http://localhost:3000

echo App started! You can close this window if the server window is running.
timeout /t 3 >nul
exit
