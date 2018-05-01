#!/usr/bin/env bash
sudo docker stop vendingui
sudo docker rm vendingui
/home/pjsong/vending/vending-ui/docker/apache/builddockerfile.sh
sudo docker run -d --network omd-network --ip=172.18.0.5 \
--add-host api.scheduler.oursmedia.cn:139.199.179.89 \
--add-host static.oursmedia.cn:139.199.179.89 \
--name vendingui --restart=unless-stopped docker-registry.pengel.cn/vendingui

