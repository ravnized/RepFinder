FROM node:19.1.0
RUN mkdir -p /code
WORKDIR /code
COPY package*.json .
RUN npm install
RUN npm install --save body-parser express mongoose
RUN npm install --save nodemon typescript ts-node ts-node-dev
RUN npm install --save-dev tsc-watch
COPY . /code/
CMD [ "npm", "run", "dev" ]