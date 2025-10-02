# Backend API

FastAPI-based REST API for Network Device Inventory.

## Setup

1. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create `.env` file from `.env.example`

4. Run the application:
   ```bash
   python main.py
   ```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database Models

- **User**: User accounts with authentication
- **Device**: Network device inventory

## Authentication

Uses JWT tokens with role-based access:
- `admin`: Full access to all resources
- `user`: Limited access to own devices
