FROM node:12.18-alpine
# Docker file for BadBank client 
# Define Environment variables 
ENV NODE_ENV production
ENV PORT 3000
ENV DEBUG false
# Create server directory 
RUN mkdir -p /usr/src/client
RUN mkdir -p /usr/src/client/public
RUN mkdir -p /usr/src/client/src
WORKDIR /usr/src/client

# copy package files 
COPY ./package*.json /usr/src/client
# copy client side JS 
COPY ./src/*.* /usr/src/client/src
# copy client side public files 
COPY ./public/*.* /usr/src/client/public

#RUN npm install --production --silent && mv node_modules ../
RUN npm install --production --silent
#COPY . .
EXPOSE 3000
CMD ["npm", "start"]
