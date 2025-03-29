FROM node:20-alpine

WORKDIR /app

# Copy only package.json and package-lock.json first
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

# Copy the entire backend source code
COPY . .

# Build the backend (usually transpile TypeScript to dist/)
RUN npm run build

# Remove devDependencies after build
RUN npm prune --omit=dev

EXPOSE 8000

CMD ["node", "dist/index.js"]
