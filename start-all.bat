@echo off
REM Start all components of the Network Device Inventory application

echo Starting Network Device Inventory Application
echo.

REM Check if backend database exists
if not exist "backend\network_inventory.db" (
    echo Database not found. Initializing...
    cd backend
    python init_db.py
    cd ..
)

REM Start Backend
echo Starting Backend API...
cd backend
if not exist "venv" (
    python -m venv venv
)
call venv\Scripts\activate
start "Backend API" cmd /k python main.py
cd ..
timeout /t 3 /nobreak

REM Start Frontend
echo Starting Frontend...
cd frontend
start "Frontend" cmd /k npm run dev
cd ..
timeout /t 3 /nobreak

REM Ask about Microservice
set /p START_MICRO="Start Microservice? (y/n): "
if /i "%START_MICRO%"=="y" (
    echo Starting Microservice...
    cd microservices
    if not exist "venv" (
        python -m venv venv
    )
    call venv\Scripts\activate
    start "Microservice" cmd /k python sync_service.py
    cd ..
)

echo.
echo All components started!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Default admin credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo Close the command windows to stop the services
pause
