FROM node:22
WORKDIR /app
COPY package* ./
RUN npm install
RUN npm install -g nodemon
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev"]
