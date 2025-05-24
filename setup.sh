#!/bin/bash
set -e

echo "🔧 Setting up the project environment..."

# Function to handle errors
handle_error() {
  echo "❌ Error: $1"
  echo "⚠️ Setup failed but you can try again or proceed manually."
}

# Check for required dependencies
if ! command -v curl &>/dev/null; then
  handle_error "curl is not installed. Please install curl first."
  exit 1
fi

if ! command -v git &>/dev/null; then
  handle_error "Git is not installed. Please install Git first."
  exit 1
fi

# Install or ensure Bun is available
if ! command -v bun &>/dev/null; then
  echo "⚙️ Bun is not installed. Installing Bun..."
  if curl -fsSL https://bun.sh/install | bash; then
    # Source profile to make bun available in current session
    export PATH="$HOME/.bun/bin:$PATH"
    echo "✅ Bun installed successfully!"
  else
    handle_error "Failed to install Bun. Please install it manually: https://bun.sh"
    exit 1
  fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
if ! bun install; then
  handle_error "Failed to install dependencies. Please check your network connection or package.json."
  exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "🔑 Creating .env file from .env.example..."
  if [ -f .env.example ]; then
    cp .env.example .env && echo "✅ .env file created from .env.example."
    echo "⚠️ Please update the .env file with your actual credentials."
  else
    handle_error ".env.example not found. Please create .env file manually."
  fi
fi

# Set up husky git hooks
echo "🪝 Setting up Git hooks..."
if ! bun husky install 2>/dev/null; then
  handle_error "Failed to set up Git hooks. This is non-critical, you can continue."
fi

# Check for Docker (non-critical)
DOCKER_AVAILABLE=true
if ! command -v docker &> /dev/null; then
  echo "⚠️ Docker is not installed. Some features may not work correctly."
  DOCKER_AVAILABLE=false
fi

# Check for Docker Compose (non-critical)
COMPOSE_AVAILABLE=true
if $DOCKER_AVAILABLE && ! command -v docker-compose &> /dev/null && ! docker compose version &>/dev/null; then
  echo "⚠️ Docker Compose is not installed. Some features may not work correctly."
  COMPOSE_AVAILABLE=false
fi

# Start Docker services if available
if $DOCKER_AVAILABLE && $COMPOSE_AVAILABLE; then
  echo "🐳 Starting Docker services..."
  if docker compose version &>/dev/null; then
    if ! docker compose up -d; then
      handle_error "Failed to start Docker services with docker compose. You may need to run them manually."
    fi
  elif command -v docker-compose &>/dev/null; then
    if ! docker-compose up -d; then
      handle_error "Failed to start Docker services with docker-compose. You may need to run them manually."
    fi
  fi
fi

# Generate CSS files
echo "🎨 Generating CSS..."
if ! bun run build:css; then
  handle_error "Failed to generate CSS. You can run 'bun run build:css' manually later."
fi

# Set up scripts to be executable
echo "📜 Making scripts executable..."
if [ -d "./scripts" ]; then
  find ./scripts -name "*.ts" -exec chmod +x {} \; || echo "⚠️ Failed to make some scripts executable."
  find ./scripts -name "*.sh" -exec chmod +x {} \; || echo "⚠️ Failed to make some scripts executable."
else
  mkdir -p ./scripts
  echo "📁 Created scripts directory."
fi

# Run any TypeScript setup scripts
if [ -f scripts/setup.ts ]; then
  echo "🔄 Running TypeScript setup script..."
  if ! bun scripts/setup.ts "$@"; then
    handle_error "Failed to run TypeScript setup script. You may need to run it manually."
  fi
fi

# Create any required directories
echo "📁 Creating required directories..."
mkdir -p public/styles || handle_error "Failed to create public/styles directory."

# Final summary
echo ""
echo "✅ Setup complete! Here are some useful commands:"
echo "  • bun dev              - Start the development server"
echo "  • bun run typecheck       - Type check the application"
echo "  • bun run lint            - Lint the code"
echo "  • bun run prettier        - Format the code"
echo "  • bun run test:unit       - Run unit tests"
echo "  • bun precommit        - Run all pre-commit checks"
echo ""
echo "Happy coding! 🚀"
