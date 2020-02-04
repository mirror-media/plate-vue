FROM node:10-slim

RUN groupadd user && useradd --create-home --home-dir /home/user -g user user

ENV NODE_SOURCE /usr/src/

WORKDIR $NODE_SOURCE

RUN apt-get update \
	&& apt-get install -y node-gyp

ADD . $NODE_SOURCE

EXPOSE 3000
CMD ["npm", "start"]