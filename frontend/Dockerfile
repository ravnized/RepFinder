FROM node:19.1.0
RUN mkdir -p /codeFrontend
WORKDIR /codeFrontend
COPY package*.json .
RUN npm install --legacy-peer-deps
RUN mkdir -p /src
COPY ./src/ /codeFrontend/src
COPY tsconfig.json .
EXPOSE 3000
CMD [ "npm", "start" ]