FROM node:18

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build the Next.js frontend
RUN npm run build

EXPOSE 3000

# Start in production mode
CMD ["npm", "run", "start"]
