FROM node:18-alpine
RUN mkdir /frontend
WORKDIR /frontend
ENV PATH /frontend/node_modules/.bin:$PATH
COPY package.json /frontend/package.json
COPY /public /frontend/public
COPY /src /frontend/src
RUN npm install
RUN #npm install react-scripts@5.0.1 -g --silent
# Expose port for backend
EXPOSE 3000
CMD ["npm", "start"]