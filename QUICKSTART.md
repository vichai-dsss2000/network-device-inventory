# Quick Start Guide

This guide will help you get the Network Device Inventory application up and running quickly.

## Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn

## Quick Setup (All Components)

### 1. Backend API Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database with default admin user
python init_db.py

# Start the backend server
python main.py
```

The API will be available at `http://localhost:8000`
- API Documentation (Swagger): `http://localhost:8000/docs`
- Default admin credentials: `admin` / `admin123`

### 2. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Microservice Setup (Optional)

Open a new terminal:

```bash
# Navigate to microservices directory
cd microservices

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file (optional)
echo "DATABASE_URL=sqlite:///../backend/network_inventory.db" > .env
echo "SYNC_INTERVAL_MINUTES=60" >> .env

# Start the sync service
python sync_service.py
```

## Using the Application

### 1. First Login

1. Open your browser and navigate to `http://localhost:3000`
2. Click "Login"
3. Use the default credentials:
   - Username: `admin`
   - Password: `admin123`
4. You'll be redirected to the dashboard

### 2. Adding a Device

1. Navigate to "Devices" from the navigation bar
2. Click "Add Device"
3. Fill in the device details:
   - **Hostname**: Device hostname (e.g., `router-01`)
   - **IP Address**: Device IP address (e.g., `192.168.1.1`)
   - **Device Type**: Select from supported types (cisco_ios, cisco_nxos, etc.)
   - **SSH Port**: Default is 22
   - **Username**: SSH username for device access
   - **Password**: SSH password for device access
   - **Enable Password**: (Optional) Enable password if required
   - **Status**: active, inactive, or pending
   - **Location**: (Optional) Physical location
   - **Description**: (Optional) Device description
4. Click "Create"

### 3. Managing Users (Admin Only)

1. Navigate to "Users" from the navigation bar
2. View all registered users
3. Edit user roles (admin or user)
4. Activate or deactivate user accounts
5. Delete users if needed

### 4. Syncing Device Configurations

If you've started the microservice:

1. The service automatically syncs all active devices based on the configured interval (default: 60 minutes)
2. Device configurations are retrieved via SSH and stored in the database
3. Check the "Last Sync" column in the devices table to see when each device was last synced

## Docker Setup (Alternative)

If you prefer using Docker:

```bash
# From the project root directory
docker-compose up -d

# Initialize the database
docker-compose exec backend python init_db.py
```

All services will start automatically:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- Microservice: Running in background

## Troubleshooting

### Backend won't start

- Make sure you've installed all dependencies: `pip install -r requirements.txt`
- Check if port 8000 is already in use
- Verify Python version: `python --version` (should be 3.8+)

### Frontend won't start

- Make sure you've installed all dependencies: `npm install`
- Check if port 3000 is already in use
- Verify Node.js version: `node --version` (should be 18+)
- Ensure `.env.local` file exists with correct API URL

### Can't login

- Make sure the backend is running
- Verify the database was initialized: Check for `network_inventory.db` in the backend directory
- Check browser console for errors

### Microservice can't connect to devices

- Verify device credentials are correct
- Ensure devices are reachable from the machine running the microservice
- Check device SSH/Telnet access is enabled
- Verify the correct device type is selected

## Next Steps

1. **Change the default admin password**: Go to the database and update it, or create a new admin user
2. **Configure environment variables**: Update `.env` files with production values
3. **Set up HTTPS**: Use a reverse proxy like Nginx for production deployments
4. **Add more devices**: Start adding your network devices to the inventory
5. **Schedule regular syncs**: Configure the microservice sync interval based on your needs

## Support

For issues and questions:
- Check the main README.md for detailed documentation
- Review the component-specific READMEs in each directory
- Open an issue on the GitHub repository

## Security Notes

⚠️ **Important for Production:**

1. Change the default admin password immediately
2. Update the `SECRET_KEY` in the backend configuration
3. Use environment variables for sensitive data
4. Enable HTTPS for all connections
5. Consider encrypting device credentials in the database
6. Set up proper firewall rules
7. Regularly update dependencies for security patches
