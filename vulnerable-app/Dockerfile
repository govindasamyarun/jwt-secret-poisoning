FROM node:lts-alpine3.17
RUN apk add --no-cache \
    g++ \
    make \
    pkgconfig \
    libsecret \
    libsecret-dev \
    curl \
    py-pip

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# RUN npm config set strict-ssl false --global
RUN npm install

# Bundle app source
COPY . .

WORKDIR /usr/src/app

EXPOSE 8080
CMD [ "node", "app.js" ]
