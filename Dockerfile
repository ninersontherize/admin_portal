FROM node:14.4.0-stretch-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY entrypoint.sh /
RUN npm install
RUN apt update
RUN apt install -y curl
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
RUN cd client && yarn install && yarn build && yarn global add serve


CMD ["npm", "run", "start"]