#!/bin/bash

docker build . \
 -t image_nginx_v3:0.0.1


 docker build . -t docker_webapp_ec2

 docker run -d -it \
    --name container_image_nginx_v11 \
    -p 5011:80 \
    image_nginx_v11

nginx -t && service nginx reload


apt-get update -y
apt-get install vim
apt-get install -y iputils-ping

vim /etc/nginx/nginx.conf
vim /etc/nginx/conf.d/default.conf