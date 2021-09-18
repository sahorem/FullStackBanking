FROM node:12.18-alpine
# Docker file for BadBank server 
# Define Environment variables 
ENV NODE_ENV production
ENV PORT 4000
ENV DBURL 'mongodb://mongo:27017'
ENV DBNAME 'badbank'
ENV DEBUG false 
# Create server directory 
RUN mkdir -p /usr/src/server
WORKDIR /usr/src/server
COPY package*.json /usr/src/server
COPY *.json /usr/src/server
COPY *.js /usr/src/server
#RUN npm install --production --silent && mv node_modules ../
RUN npm install --production --silent
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
