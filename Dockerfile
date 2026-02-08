FROM node:18-alpine

WORKDIR /app

# Backend
COPY package*.json ./
RUN npm install

# Frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install

WORKDIR /app

COPY . .

# Build frontend
RUN cd client && npm run build

EXPOSE 5000

CMD ["npm", "start"]
