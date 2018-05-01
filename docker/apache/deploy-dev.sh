#!/usr/bin/env bash
sudo docker stop vendingui-dev
sudo docker rm vendingui-dev
/home/pjsong/Documents/git/bitbucket/vending-ui/docker/apache/builddockerfile-dev.sh
sudo docker run -d -v ~/Documents/git/bitbucket/vending-ui/vendingui:/var/www/html \
--add-host api.scheduler.oursmedia.cn:139.199.179.89 \
--add-host static.oursmedia.cn:139.199.179.89 \
 --network omd-network-dev --ip=172.16.0.5 --name vendingui-dev vendingui-dev
