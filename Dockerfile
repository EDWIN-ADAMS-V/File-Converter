# Base image with Node.js and LibreOffice
FROM debian:bullseye

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    libreoffice \
    nodejs \
    npm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install Node.js dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
