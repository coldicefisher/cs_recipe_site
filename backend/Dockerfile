# ./backend/Dockerfile
FROM node:20
WORKDIR /app

COPY package*.json ./
RUN npm ci


ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
