#!/usr/bin/env bash
sudo docker stop vendingui
sudo docker rm vendingui
sudo docker run -d --network omd-network --ip=172.18.0.5 --name vendingui \
--add-host static.oursmedia.cn:139.199.179.89 \
--add-host api.scheduler.oursmedia.cn:139.199.179.89 \
--restart=unless-stopped docker-registry.pengel.cn/vendingui
