FROM sail-8.3/app

# PHP 設定のカスタマイズ
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini

# ulimitの設定をシェルで行う
RUN echo "ulimit -n 65536" >> /etc/profile

# CMDはシェル経由で起動する
CMD ["/bin/bash", "-c", "source /etc/profile && exec /bin/bash"]