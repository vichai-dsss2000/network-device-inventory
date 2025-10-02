# Network Device Inventory

A comprehensive network device management system with a Next.js frontend, FastAPI backend, and Netmiko microservice for automated device configuration retrieval.

## Features

- **Frontend (Next.js + Bootstrap)**
  - Admin dashboard with device statistics
  - Device management (CRUD operations)
  - User management with role-based access control
  - JWT authentication
  - Responsive design with Bootstrap CSS

- **Backend API (FastAPI)**
  - RESTful API for device and user management
  - JWT-based authentication with role-based access (admin/user)
  - SQLite database for data persistence
  - CORS support for frontend integration

- **Microservice (Python + Netmiko)**
  - Automated SSH/Telnet connections to network devices
  - Configuration retrieval from multiple device types (Cisco, Juniper, etc.)
  - Scheduled sync of device configurations
  - Database integration for storing configurations

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Bootstrap 5, React Bootstrap, Axios
- **Backend**: FastAPI, SQLAlchemy, Python-Jose (JWT), Passlib (bcrypt)
- **Microservice**: Netmiko, SQLAlchemy, Schedule
- **Database**: SQLite
- **Authentication**: JWT with role-based access control

## Project Structure

```
network-device-inventory/
├── frontend/           # Next.js application
│   ├── app/           # App router pages
│   ├── components/    # React components
│   ├── lib/          # Utilities and API client
│   └── package.json
├── backend/           # FastAPI application
│   ├── main.py       # FastAPI app entry point
│   ├── models.py     # Database models
│   ├── schemas.py    # Pydantic schemas
│   ├── auth.py       # Authentication logic
│   ├── database.py   # Database configuration
│   ├── config.py     # Application settings
│   └── requirements.txt
└── microservices/     # Netmiko sync service
    ├── sync_service.py      # Main sync service
    ├── device_connector.py  # Netmiko wrapper
    ├── config.py           # Service configuration
    └── requirements.txt
```

## Installation & Setup

### Prerequisites

- Python 3.8+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file (optional):
   ```env
   DATABASE_URL=sqlite:///./network_inventory.db
   SECRET_KEY=your-secret-key-here
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. Run the backend:
   ```bash
   python main.py
   ```

   The API will be available at `http://localhost:8000`
   API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

### Microservice Setup

1. Navigate to the microservices directory:
   ```bash
   cd microservices
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file (optional):
   ```env
   DATABASE_URL=sqlite:///../backend/network_inventory.db
   SYNC_INTERVAL_MINUTES=60
   ```

5. Run the sync service:
   ```bash
   python sync_service.py
   ```

## Usage

### First Time Setup

1. Start the backend API
2. Start the frontend application
3. Navigate to `http://localhost:3000`
4. Register a new account (first user should be created as admin via direct database modification or API)
5. Login with your credentials

### Creating an Admin User

You can create an admin user by:

1. Using the API directly:
   ```bash
   curl -X POST "http://localhost:8000/api/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "username": "admin",
       "email": "admin@example.com",
       "password": "admin123",
       "full_name": "Administrator",
       "role": "admin"
     }'
   ```

2. Or modify a user's role in the database after registration

### Adding Devices

1. Login to the dashboard
2. Navigate to "Devices" page
3. Click "Add Device"
4. Fill in device details:
   - Hostname
   - IP Address
   - Device Type (cisco_ios, cisco_nxos, juniper, etc.)
   - SSH credentials
   - Other optional fields
5. Click "Create"

### Syncing Device Configurations

The microservice will automatically sync device configurations based on the configured interval. You can also:

1. Start the sync service manually
2. The service will connect to all active devices
3. Retrieve configurations via SSH/Telnet
4. Store configurations in the database

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user

### Devices
- `GET /api/devices` - List devices
- `POST /api/devices` - Create device
- `GET /api/devices/{id}` - Get device
- `PUT /api/devices/{id}` - Update device
- `DELETE /api/devices/{id}` - Delete device

### Users (Admin only)
- `GET /api/users` - List users
- `GET /api/users/{id}` - Get user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Role-based access control (admin/user)
- CORS configured for frontend access
- Device credentials are stored in database (consider encryption for production)

## Development

### Running Tests

Backend tests:
```bash
cd backend
pytest
```

Frontend tests:
```bash
cd frontend
npm test
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
npm start
```

Backend:
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the GitHub repository.