# Frontend Application

Next.js-based admin dashboard for Network Device Inventory.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- User authentication (login/register)
- Dashboard with device statistics
- Device management (CRUD)
- User management (admin only)
- Role-based access control

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Bootstrap 5 / React Bootstrap
- Axios for API calls

## Pages

- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Main dashboard
- `/devices` - Device management
- `/users` - User management (admin only)

## Build for Production

```bash
npm run build
npm start
```
