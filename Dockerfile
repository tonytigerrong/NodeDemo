FROM node:10
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD node app
EXPOSE 8888
# build: docker build -t nodedemo .
# run  : docker run -it -p 8888:4000 nodedemo