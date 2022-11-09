FROM node:latest
USER root

# install curl
#RUN apk update \
#    && apk add --update curl rsync \
#    && rm -rf /var/cache/apk/* \
#    && apk upgrade

# install nodejs, npm
#RUN apk add --update npm \
# install git
#    && apk add --no-cache bash git openssh

# create a directory to shove the code into
RUN mkdir /express-ts-api-boilerplate
RUN mkdir /logs
RUN mkdir /api

# clone branch
RUN git clone -b main https://github.com/dhlevi/express-ts-api-boilerplate.git /express-ts-api-boilerplate

WORKDIR /express-ts-api-boilerplate

RUN npm install -g typescript
RUN npm install
RUN npm run build

WORKDIR /

# COPY express-ts-api-boilerplate/build /api

ENTRYPOINT ["node express-ts-api-boilerplate/build/index.js"]

# CMD tail -f /dev/null
# docker build . -t express_boilerplate
# docker run --name express_boilerplate_api -p 8080:1337 express_boilerplate:latest
# add any environment vars needed with -e