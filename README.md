# Network Device Inventory

A comprehensive web-based application for managing and tracking network devices in your infrastructure. This system provides real-time visibility into network equipment, their configurations, and status.

## Project Overview

Network Device Inventory is designed to help IT teams and network administrators maintain an organized catalog of all network devices including routers, switches, firewalls, access points, and other networking equipment. The application provides features for device registration, monitoring, and lifecycle management.

## Features

- **Device Management**: Add, edit, and delete network devices with detailed information
- **Inventory Tracking**: Maintain comprehensive records of device specifications, serial numbers, and locations
- **Status Monitoring**: Real-time device status and health checks
- **Search & Filter**: Quick search and advanced filtering capabilities
- **User Authentication**: Secure access control and user management
- **Export/Import**: Bulk operations and data portability
- **Dashboard**: Visual overview of network infrastructure
- **Reporting**: Generate reports on device inventory and utilization

## Technology Stack

- **Frontend**: Next.js, React
- **Styling**: CSS Modules / Tailwind CSS (to be determined)
- **State Management**: React Context / Redux (to be determined)
- **Backend**: Next.js API Routes / Node.js
- **Database**: (to be determined - MongoDB/PostgreSQL/MySQL)
- **Authentication**: NextAuth.js / JWT
- **Deployment**: Vercel / Custom hosting

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18.x or higher)
- npm or yarn package manager
- Git

## Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vichai-dsss2000/network-device-inventory.git
   cd network-device-inventory
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```
   DATABASE_URL=your_database_connection_string
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run database migrations** (when applicable)
   ```bash
   npm run migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
network-device-inventory/
├── .next/              # Next.js build output
├── node_modules/       # Dependencies
├── public/             # Static assets
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/    # Reusable React components
│   ├── lib/           # Utility functions and helpers
│   ├── models/        # Data models
│   ├── styles/        # Global styles
│   └── types/         # TypeScript type definitions
├── .env.local         # Environment variables (local)
├── .gitignore         # Git ignore rules
├── next.config.js     # Next.js configuration
├── package.json       # Project dependencies
├── README.md          # This file
└── tsconfig.json      # TypeScript configuration
```

## Development Workflow

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run type-check` - Run TypeScript type checking

### Development Tasks

#### Phase 1: Project Setup ✓
- [x] Initialize project repository
- [x] Set up Next.js project structure
- [x] Configure development environment
- [x] Create README documentation
- [x] Set up TypeScript configuration
- [x] Configure Tailwind CSS
- [x] Create basic API structure
- [x] Set up testing framework
- [x] Configure ESLint

#### Phase 2: Core Features (In Progress)
- [ ] Set up database schema
- [ ] Implement authentication system
- [ ] Create device CRUD operations
- [ ] Design and implement UI components
- [ ] Add device list and detail views
- [ ] Implement search and filter functionality

#### Phase 3: Advanced Features
- [ ] Add device status monitoring
- [ ] Implement dashboard with statistics
- [ ] Create reporting functionality
- [ ] Add import/export capabilities
- [ ] Implement device grouping/categorization
- [ ] Add notification system

#### Phase 4: Testing & Optimization
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Performance optimization
- [ ] Security audit
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing

#### Phase 5: Deployment
- [ ] Set up CI/CD pipeline
- [ ] Configure production environment
- [ ] Deploy to production
- [ ] Set up monitoring and logging
- [ ] Create user documentation

## Database Schema

### Devices Table
- id (Primary Key)
- name
- type (router, switch, firewall, etc.)
- manufacturer
- model
- serial_number
- ip_address
- mac_address
- location
- status (active, inactive, maintenance)
- purchase_date
- warranty_expiry
- notes
- created_at
- updated_at

### Users Table
- id (Primary Key)
- username
- email
- password_hash
- role (admin, user)
- created_at
- updated_at

## API Endpoints

### Device Management
- `GET /api/devices` - List all devices
- `GET /api/devices/:id` - Get device details
- `POST /api/devices` - Create new device
- `POST /api/devices/discovery` - Create/Import all new devices from list of ip adress
- `PUT /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - User registration
- `GET /api/auth/session` - Get current session

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Keep code DRY and maintainable

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm run start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | Database connection string | Yes |
| NEXTAUTH_SECRET | Secret for NextAuth.js | Yes |
| NEXTAUTH_URL | Application URL | Yes |
| API_KEY | External API key (if needed) | No |

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 3000
kill -9 $(lsof -ti:3000)
```

**Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

- Project Owner: vichai-dsss2000
- Repository: https://github.com/vichai-dsss2000/network-device-inventory

## Acknowledgments

- Next.js team for the amazing framework
- All contributors who help improve this project

## Roadmap

### Version 1.0 (MVP)
- Basic device CRUD operations
- User authentication
- Simple search functionality
- Basic dashboard

### Version 2.0
- Advanced filtering and reporting
- Device health monitoring
- Email notifications
- Bulk operations

### Version 3.0
- Multi-tenant support
- API integrations
- Mobile app
- Advanced analytics

## Support

If you encounter any issues or have questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Note**: This is an active development project. Features and documentation are subject to change.