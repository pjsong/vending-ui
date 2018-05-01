# wiki.apache.org/httpd/DistrosDefaultLayout
#www.cyberciti.biz/faq/ubuntu-linux-start-restart-stop-apache-web-server
FROM omd-apache2
ADD vendingui /var/www/html
COPY ./wait-for-it.sh /

ENV APACHE_RUN_USER pjsong
ENV APACHE_RUN_GROUP pjsong
ENV APACHE_PID_FILE /var/run/apache2.pid
ENV APACHE_RUN_DIR /var/run/apache2
ENV APACHE_LOCK_DIR /var/lock/apache2
ENV APACHE_LOG_DIR /var/log/apache2
#CMD ["/usr/sbin/service", "apache2", "start"]
CMD ["/wait-for-it.sh", "172.18.0.4:80", "-t", "0", "--", "apache2ctl", "-D", "FOREGROUND"]
#ENTRYPOINT ["/usr/sbin/apache2", "-DFORGROUND"]
EXPOSE 80
