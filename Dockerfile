FROM node:alpine
WORKDIR /usr/app
COPY . .
# COPY package.json .
RUN npm install
CMD ["npm", "run", "start"]
