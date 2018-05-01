#http://www.31a2ba2a-b718-11dc-8314-0800200c9a66.com/2016/10/docker-for-angular-2-devs.html
#https://github.com/angular/quickstart/tree/npm-run-all
# To build and run with Docker:
#
#  $ docker build -t ng2-quickstart .
#  $ docker run -it --rm -p 3000:3000 -p 3001:3001 ng2-quickstart
#
FROM node:7.4

RUN mkdir -p /vendor-ui /home/nodejs && \
    groupadd -r nodejs && \
    useradd -r -g nodejs -d /home/nodejs -s /sbin/nologin nodejs && \
    chown -R nodejs:nodejs /home/nodejs

WORKDIR /vendor-ui
COPY package.json typings.json /vendor-ui/
RUN npm config set phantomjs_cdnurl=https://bitbucket.org/ariya/phantomjs/downloads

# following 2 lines not compatible with proxy
#RUN npm config set registry http://172.17.0.2:8081/repository/npmjs/

RUN npm install
# or RUN npm install --unsafe-perm=true

COPY . /vendor-ui
RUN chown -R nodejs:nodejs /vendor-ui
USER nodejs

CMD npm start
