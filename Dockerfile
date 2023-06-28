FROM node:14.8.0-slim

RUN groupadd user && useradd --create-home --home-dir /home/user -g user user

ENV NODE_SOURCE /usr/src/

WORKDIR $NODE_SOURCE

RUN echo "deb http://security.debian.org/debian-security bullseye-security main contrib non-free" > /etc/apt/sources.list

#RUN apt-get update \
#	&& apt-get install -y node-gyp
RUN apt-get update

ADD . $NODE_SOURCE

EXPOSE 3000
CMD ["npm", "start"]
