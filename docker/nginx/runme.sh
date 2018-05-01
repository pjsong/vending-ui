#!/usr/bin/env bash
docker build -t images-nginx .
docker run --name images-nginx -d -h images images-nginx
sudo docker run --name images-nginx -d -v ~/Documents/git/oschina/pics/html:/usr/share/nginx/html -h images --restart unless-stopped images-nginx

docker cp image-nginx:/etc/nginx/nginx.conf ./conf
docker cp image-nginx:/etc/nginx/conf.d ./conf
