FROM php:8.2-apache

RUN apt-get update && \
    apt-get install -y default-mysql-client netcat-openbsd && \
    docker-php-ext-install mysqli && \
    docker-php-ext-enable mysqli && \
    a2enmod rewrite

WORKDIR /var/www/html

COPY wait-for-db.sh /usr/local/bin/wait-for-db.sh
RUN chmod +x /usr/local/bin/wait-for-db.sh

ENTRYPOINT ["wait-for-db.sh"]
