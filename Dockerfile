FROM node:18-alpine
RUN mkdir /code
RUN cd /code
RUN apk add --update --no-cache ttf-freefont
RUN apk add --update --no-cache graphviz
RUN apk add --update --no-cache openjdk8
WORKDIR /code
