#!/usr/bin/env bash
rm -rf ./vendingui
npm run build
sudo docker build -t vendingui .
sudo docker tag vendingui docker-registry.pengel.cn/vendingui

