FROM nginx:latest

RUN echo '++++++++ Something Hello Docker -y+++++ +++'

RUN apt -y update && \
    apt -y install vim && \
    apt install -y iputils-ping

COPY nginx.conf /etc/nginx/nginx.conf