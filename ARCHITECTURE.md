# System Architecture

## Overview

The Network Device Inventory application follows a microservices architecture with three main components working together.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                            Web Browser                              │
│                        (http://localhost:3000)                      │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               │ HTTP/HTTPS
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                         Frontend (Next.js)                          │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Pages:                                                     │    │
│  │  - Home (/)                                                 │    │
│  │  - Login (/login)                                          │    │
│  │  - Register (/register)                                    │    │
│  │  - Dashboard (/dashboard) [Protected]                      │    │
│  │  - Devices (/devices) [Protected]                          │    │
│  │  - Users (/users) [Protected, Admin Only]                  │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  Components: Navbar, ProtectedRoute                                 │
│  Libraries: React Bootstrap, Axios                                  │
│  State: localStorage (JWT token)                                    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               │ REST API
                               │ (JWT Auth)
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                        Backend API (FastAPI)                        │
│                        (http://localhost:8000)                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Endpoints:                                                 │    │
│  │  Auth:     POST /api/auth/login                            │    │
│  │            POST /api/auth/register                         │    │
│  │            GET  /api/auth/me                               │    │
│  │                                                             │    │
│  │  Devices:  GET    /api/devices                             │    │
│  │            POST   /api/devices                             │    │
│  │            GET    /api/devices/{id}                        │    │
│  │            PUT    /api/devices/{id}                        │    │
│  │            DELETE /api/devices/{id}                        │    │
│  │                                                             │    │
│  │  Users:    GET    /api/users [Admin]                       │    │
│  │            GET    /api/users/{id} [Admin]                  │    │
│  │            PUT    /api/users/{id} [Admin]                  │    │
│  │            DELETE /api/users/{id} [Admin]                  │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  Auth: JWT with bcrypt                                              │
│  ORM: SQLAlchemy                                                    │
│  Validation: Pydantic                                               │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               │ Database
                               │ Queries/Updates
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                    Database (SQLite)                                │
│                    network_inventory.db                             │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Tables:                                                    │    │
│  │                                                             │    │
│  │  users                          devices                     │    │
│  │  ├─ id                           ├─ id                      │    │
│  │  ├─ username                     ├─ hostname                │    │
│  │  ├─ email                        ├─ ip_address              │    │
│  │  ├─ hashed_password              ├─ device_type             │    │
│  │  ├─ full_name                    ├─ ssh_port                │    │
│  │  ├─ role (admin/user)            ├─ username                │    │
│  │  ├─ is_active                    ├─ password                │    │
│  │  └─ created_at                   ├─ configuration           │    │
│  │                                   ├─ status                  │    │
│  │                                   ├─ last_sync               │    │
│  │                                   ├─ owner_id [FK]           │    │
│  │                                   └─ created_at              │    │
│  └────────────────────────────────────────────────────────────┘    │
└──────────────────────────────▲──────────────────────────────────────┘
                               │
                               │ Database
                               │ Read/Write
                               │
┌──────────────────────────────┴──────────────────────────────────────┐
│                  Microservice (Python + Netmiko)                    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Sync Service:                                              │    │
│  │  - Scheduled sync (every N minutes)                         │    │
│  │  - Query active devices from database                       │    │
│  │  - Connect via SSH/Telnet                                   │    │
│  │  - Retrieve device configuration                            │    │
│  │  - Update database with configuration                       │    │
│  │  - Update last_sync timestamp                               │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  Device Connector:                                                  │
│  - SSH/Telnet connection handling                                   │
│  - Multi-platform support                                           │
│  - Command execution                                                │
│  - Error handling                                                   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               │ SSH/Telnet
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                        Network Devices                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │ Cisco IOS   │  │ Cisco NX-OS │  │  Juniper    │  ...           │
│  │ Router/     │  │ Switch      │  │  Router     │                │
│  │ Switch      │  │             │  │             │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Authentication Flow

```
User -> Frontend (Login Page)
  │
  └─> POST /api/auth/login (username, password)
        │
        └─> Backend validates credentials
              │
              ├─> If valid: Generate JWT token
              │     │
              │     └─> Return token to Frontend
              │           │
              │           └─> Store token in localStorage
              │                 │
              │                 └─> Redirect to Dashboard
              │
              └─> If invalid: Return error
```

### 2. Device Management Flow

```
User -> Frontend (Devices Page)
  │
  └─> GET /api/devices (with JWT token)
        │
        └─> Backend validates token
              │
              ├─> If valid:
              │     │
              │     └─> Query devices from database
              │           │
              │           └─> Return device list
              │                 │
              │                 └─> Frontend displays devices
              │
              └─> If invalid: Return 401 Unauthorized
```

### 3. Device Configuration Sync Flow

```
Microservice (Scheduled)
  │
  └─> Query active devices from database
        │
        └─> For each device:
              │
              ├─> Connect via SSH/Telnet (Netmiko)
              │     │
              │     └─> Execute "show running-config"
              │           │
              │           ├─> If successful:
              │           │     │
              │           │     └─> Store configuration in database
              │           │           │
              │           │           └─> Update last_sync timestamp
              │           │
              │           └─> If failed:
              │                 │
              │                 └─> Log error and continue
              │
              └─> Disconnect
```

## Component Communication

### Frontend ↔ Backend
- **Protocol**: HTTP/HTTPS
- **Format**: JSON
- **Authentication**: JWT Bearer token in Authorization header
- **CORS**: Enabled for localhost:3000

### Backend ↔ Database
- **Protocol**: SQLite file I/O
- **ORM**: SQLAlchemy
- **Connection**: Shared connection pool
- **Transactions**: Auto-commit mode

### Microservice ↔ Database
- **Protocol**: SQLite file I/O
- **ORM**: SQLAlchemy
- **Connection**: Separate connection pool
- **Transactions**: Explicit commit after sync

### Microservice ↔ Network Devices
- **Protocol**: SSH (port 22) or Telnet
- **Library**: Netmiko
- **Connection**: Per-device connection
- **Timeout**: Configurable

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│ Frontend:                                                   │
│  - ProtectedRoute component                                 │
│  - Token validation before navigation                       │
│  - Role-based UI rendering                                  │
├─────────────────────────────────────────────────────────────┤
│ Network:                                                    │
│  - CORS configuration                                       │
│  - JWT tokens in HTTP headers                               │
│  - HTTPS recommended for production                         │
├─────────────────────────────────────────────────────────────┤
│ Backend:                                                    │
│  - JWT token validation middleware                          │
│  - Role-based access control decorators                     │
│  - Password hashing with bcrypt                             │
│  - SQL injection prevention (ORM)                           │
├─────────────────────────────────────────────────────────────┤
│ Database:                                                   │
│  - Hashed passwords only                                    │
│  - Foreign key constraints                                  │
│  - Transaction isolation                                    │
└─────────────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Current Architecture
- **Database**: SQLite (single file, good for small deployments)
- **Backend**: Single process (uvicorn)
- **Frontend**: Node.js development server
- **Microservice**: Single process with scheduled tasks

### Scaling Options

1. **Database Migration**
   - Replace SQLite with PostgreSQL/MySQL
   - Add connection pooling
   - Implement read replicas

2. **Backend Scaling**
   - Deploy multiple FastAPI instances
   - Add load balancer (Nginx)
   - Use Gunicorn with multiple workers

3. **Frontend Scaling**
   - Build static files
   - Deploy to CDN
   - Add caching layer

4. **Microservice Scaling**
   - Deploy multiple instances
   - Add message queue (RabbitMQ/Redis)
   - Implement distributed task system (Celery)

## Deployment Architecture

### Development
```
localhost:3000 (Frontend) ─┐
                           ├─> localhost:8000 (Backend) ─> SQLite
                           │
Microservice Process ──────┘
```

### Docker Deployment
```
Container: frontend:3000 ─┐
                          ├─> Container: backend:8000 ─┐
                          │                            ├─> Volume: db-data
Container: microservice ──┘                            │   (SQLite)
                                                       │
                                                       └─> Network: app-network
```

### Production Recommendation
```
Internet
   │
   └─> Load Balancer (HTTPS)
         │
         ├─> Frontend Servers (Multiple)
         │     └─> Static Files + Next.js SSR
         │
         └─> Backend Servers (Multiple)
               │
               └─> Database Cluster (PostgreSQL)
                     │
                     └─> Message Queue ─> Microservice Workers (Multiple)
```

## Technology Choices

### Why Next.js?
- Modern React framework with SSR support
- Built-in routing and optimization
- TypeScript support out of the box
- Easy deployment options

### Why FastAPI?
- Fast and modern Python web framework
- Automatic API documentation
- Native async support
- Type hints and validation

### Why SQLite?
- Zero configuration
- Single file database
- Perfect for development and small deployments
- Easy to backup and migrate

### Why Netmiko?
- Industry-standard for network automation
- Supports multiple device types
- Robust error handling
- Active community support

## Monitoring & Logging

### Current Implementation
- Console logging in all components
- FastAPI automatic request logging
- Netmiko connection logging

### Recommended Additions
- Centralized logging (ELK Stack)
- Application monitoring (Prometheus)
- Error tracking (Sentry)
- Performance monitoring (New Relic)

## Backup Strategy

### Database Backup
```bash
# Manual backup
cp backend/network_inventory.db backup/network_inventory_$(date +%Y%m%d).db

# Automated backup (cron)
0 2 * * * /path/to/backup-script.sh
```

### Configuration Backup
- Device configurations stored in database
- Database backups include all configurations
- Consider separate archive for historical configs

## Future Enhancements

1. **High Availability**: Database replication, load balancing
2. **Multi-tenancy**: Separate data by organization
3. **Advanced Features**: Configuration diff, rollback, compliance checking
4. **Integration**: Monitoring tools, ticketing systems, IPAM
5. **Analytics**: Reports, dashboards, trends analysis
