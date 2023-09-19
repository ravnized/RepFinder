FROM node:19.1.0
RUN mkdir -p /codeFrontend
WORKDIR /codeFrontend
COPY package*.json .
RUN npm install --force
RUN mkdir -p /src
COPY ./src/ /codeFrontend/src
COPY tsconfig.json .
COPY /public/ /codeFrontend/public
EXPOSE 3000
CMD [ "npm", "start" ]