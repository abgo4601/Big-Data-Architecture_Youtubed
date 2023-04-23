FROM node:18-alpine
RUN mkdir /frontend
WORKDIR /frontend
ENV PATH /frontend/node_modules/.bin:$PATH
COPY package.json /frontend/package.json
COPY package-lock.json /frontend/package-lock.json
RUN npm install
RUN #npm install react-scripts@5.0.1 -g --silent



#From node:16
#
## ENV NODE_ENV = development
## ENV PORT = 5000
## ENV MONGO_URI = mongodb+srv://varunb27:Boulder@proshop.w2g32.mongodb.net/ProShop
## ENV JWT_SECRET = abc123
#
#WORKDIR /usr/src/raas/frontend
#
#COPY package.json .
#COPY package-lock.json .
#
#Run npm install
#
#COPY . .
#
#EXPOSE 3000
#
#CMD ["npm" , "start"]



#// MEdium

## pull official base image
#FROM node:18-alpine
#
## set working directory
#WORKDIR /usr/src/chat-app
#
## add `/usr/src/app/node_modules/.bin` to $PATH
#ENV PATH /usr/src/chat-app/node_modules/.bin:$PATH
#
## install and cache app dependencies
#COPY package.json .
#COPY package-lock.json .
#RUN npm ci
#RUN npm install react-scripts@5.0.1 -g --silent
#
## start app
#CMD ["npm", "start"]