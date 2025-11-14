FROM node:22
WORKDIR /app
COPY package* ./
RUN npm install && npm install -g nodemon
COPY . .
EXPOSE 3002
CMD ["npm", "run", "dev"]
