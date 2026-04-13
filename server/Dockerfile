FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 3001

# Start the API after the container settles
CMD ["sh", "-c", "sleep 5 && npm run start"]
