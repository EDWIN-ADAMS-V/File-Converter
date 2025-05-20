# Use official Node.js image with Debian
FROM node:18

# Install LibreOffice
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy app files
COPY . .

# Install dependencies
RUN npm install

# Create folders if not present
RUN mkdir -p uploads converted

# Expose app port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
