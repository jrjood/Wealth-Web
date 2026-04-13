FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (force Prisma 6)
RUN npm install && npm install @prisma/client@^6.0.0 prisma@^6.0.0

# Copy prisma schema (no config.js for Prisma 6)
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

EXPOSE 3001

# Start script that waits for DB and runs migrations, with error handling
CMD ["sh", "-c", "sleep 5 && npx prisma db push && (node prisma/seed.js || true) && npm run start"]
