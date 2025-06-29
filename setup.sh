#!/bin/bash

# SavorScore Setup Script

echo "Setting up SavorScore application..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  echo "MONGODB_URI=mongodb://localhost:27017/savorscore" > .env
  echo "JWT_SECRET=changethisjwtsecretkeyinproduction" >> .env
  echo "PORT=5000" >> .env
fi

cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install

cd ..

echo "Setup complete!"
echo ""
echo "To start the application:"
echo "1. In one terminal, run: cd backend && npm run dev"
echo "2. In another terminal, run: cd frontend && npm start"
echo ""
echo "The application will be available at http://localhost:3000"
