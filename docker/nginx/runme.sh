#!/usr/bin/env bash
cd ../
docker build -t pjsong/vending-ui_demo -f docker/nginx/Dockerfile .
docker run --name vending-ui_demo --rm --network omd-network --ip 172.18.0.200 pjsong/vending-ui_demo

