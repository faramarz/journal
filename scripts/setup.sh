#!/bin/bash

# Create scripts directory if it doesn't exist
mkdir -p scripts

# Copy environment file
cp .env.local.example .env.local
echo "✅ Environment template copied to .env.local"

# Install dependencies
echo "📦 Installing packages..."
yarn install || npm install

# Done
echo "🚀 Project initialized!"

echo "Setup complete! Now update your .env.local file with your Supabase and OpenAI credentials."
echo "Run 'npm run dev' to start the development server." 