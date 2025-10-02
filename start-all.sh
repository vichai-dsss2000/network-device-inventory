#!/bin/bash

# Start all components of the Network Device Inventory application

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Network Device Inventory Application${NC}"
echo ""

# Check if backend database exists
if [ ! -f "backend/network_inventory.db" ]; then
    echo -e "${RED}Database not found. Initializing...${NC}"
    cd backend
    python init_db.py
    cd ..
fi

# Start Backend
echo -e "${GREEN}Starting Backend API...${NC}"
cd backend
source venv/bin/activate 2>/dev/null || python -m venv venv && source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..
echo -e "Backend PID: $BACKEND_PID"
sleep 3

# Start Frontend
echo -e "${GREEN}Starting Frontend...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..
echo -e "Frontend PID: $FRONTEND_PID"
sleep 3

# Start Microservice (optional)
read -p "Start Microservice? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${GREEN}Starting Microservice...${NC}"
    cd microservices
    source venv/bin/activate 2>/dev/null || python -m venv venv && source venv/bin/activate
    python sync_service.py &
    MICROSERVICE_PID=$!
    cd ..
    echo -e "Microservice PID: $MICROSERVICE_PID"
fi

echo ""
echo -e "${GREEN}All components started!${NC}"
echo -e "Frontend: ${BLUE}http://localhost:3000${NC}"
echo -e "Backend API: ${BLUE}http://localhost:8000${NC}"
echo -e "API Docs: ${BLUE}http://localhost:8000/docs${NC}"
echo ""
echo -e "Default admin credentials:"
echo -e "  Username: ${BLUE}admin${NC}"
echo -e "  Password: ${BLUE}admin123${NC}"
echo ""
echo -e "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID $MICROSERVICE_PID 2>/dev/null; exit" INT
wait
