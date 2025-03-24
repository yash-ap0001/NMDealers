# ND Motors

A modern vehicle listing website built with React, TypeScript, and Node.js.

## Features

- Browse vehicles with advanced filtering
- Detailed vehicle listings with image galleries
- Dealer profiles with business information
- Responsive design with TailwindCSS
- Type-safe development with TypeScript
- Efficient data fetching with React Query

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- React Query
- TailwindCSS
- Axios

### Backend
- Node.js
- Express
- Sequelize
- PostgreSQL
- TypeScript

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nd-motors.git
cd nd-motors
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:
```bash
# backend/.env
DATABASE_URL=postgresql://username:password@localhost:5432/nd_motors
PORT=5000
JWT_SECRET=your_jwt_secret

# frontend/.env
VITE_API_URL=http://localhost:5000
```

5. Start the development servers:

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
nd-motors/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── App.tsx
    │   └── main.tsx
    ├── public/
    ├── package.json
    └── tsconfig.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 