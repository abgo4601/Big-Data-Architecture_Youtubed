FROM node:18-alpine
RUN mkdir /frontend
WORKDIR /frontend
ENV PATH /frontend/node_modules/.bin:$PATH
COPY package.json /frontend/package.json
RUN npm install
RUN #npm install react-scripts@5.0.1 -g --silent
