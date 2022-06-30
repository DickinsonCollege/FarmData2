# This Dockerfile has been created based on those in the
# farmOS project at:
# https://github.com/farmOS/farmOS/tree/7.x-1.x/docker
# https://github.com/farmOS/farmOS/tree/7.x-1.x/docker/dev

# NOTE: If changes are made in this file that require a new image,
# bump the tag in docker-compose.yml to force a rebuild
# when main is updated.

# Inherit from the Drupal 7 image on Docker Hub.
FROM drupal:7.90

# Set the farmOS version to download.
ARG FARMOS_VERSION=7.x-1.x-dev

# Install the BCMath PHP extension.
RUN docker-php-ext-install bcmath

# Build and install the Uploadprogress PHP extension.
# See https://github.com/php/pecl-php-uploadprogress
RUN curl -fsSL 'https://github.com/php/pecl-php-uploadprogress/archive/uploadprogress-1.1.3.tar.gz' -o php-uploadprogress.tar.gz \
  && tar -xzf php-uploadprogress.tar.gz \
  && rm php-uploadprogress.tar.gz \
  && ( \
    cd pecl-php-uploadprogress-uploadprogress-1.1.3 \
    && phpize \
    && ./configure --enable-uploadprogress \
    && make \
    && make install \
  ) \
  && rm -r pecl-php-uploadprogress-uploadprogress-1.1.3 \
  && docker-php-ext-enable uploadprogress

# Build and install the GEOS PHP extension.
# See https://git.osgeo.org/gitea/geos/php-geos
RUN apt-get update && apt-get install -y libgeos-dev \
  && curl -fsSL 'https://git.osgeo.org/gitea/geos/php-geos/archive/1.0.0.tar.gz' -o php-geos.tar.gz \
  && tar -xzf php-geos.tar.gz \
  && rm php-geos.tar.gz \
  && ( \
    cd php-geos \
    && ./autogen.sh \
    && ./configure \
    && make \
    && make install \
  ) \
  && rm -r php-geos \
  && docker-php-ext-enable geos

# Set recommended PHP settings for farmOS.
# See https://v1.farmos.org/hosting/installing/#requirements
RUN { \
    echo 'memory_limit=256M'; \
    echo 'max_execution_time=240'; \
    echo 'max_input_time=240'; \
    echo 'max_input_vars=5000'; \
  } > /usr/local/etc/php/conf.d/farmOS-recommended.ini

# Set recommended realpath_cache settings.
# See https://www.drupal.org/docs/7/managing-site-performance/tuning-phpini-for-drupal
RUN { \
    echo 'realpath_cache_size=256K'; \
    echo 'realpath_cache_ttl=3600'; \
  } > /usr/local/etc/php/conf.d/realpath_cache-recommended.ini

# Download the packaged release of farmOS from drupal.org.
RUN curl -SL "http://ftp.drupal.org/files/projects/farm-${FARMOS_VERSION}-core.tar.gz" -o /tmp/farm-${FARMOS_VERSION}-core.tar.gz && \
  tar -xvzf /tmp/farm-${FARMOS_VERSION}-core.tar.gz -C /var/www/html/ --strip-components=1 && \
  chown -R www-data:www-data /var/www/html

# Copy the sites directory to /tmp/sites, so that it can be restored after a
# volume is mounted, if necessary.
RUN cp -rp /var/www/html/sites /tmp/sites

# Set the entrypoint.
#COPY docker-entrypoint.sh /usr/local/bin/
#RUN chmod u+x /usr/local/bin/docker-entrypoint.sh
#ENTRYPOINT ["docker-entrypoint.sh"]
#CMD ["apache2-foreground"]

# Set the farmOS repository URL.
ARG FARMOS_REPO=https://git.drupal.org/project/farm.git

# Set the farmOS branch to git clone.
ARG FARMOS_BRANCH=7.x-1.x

# Change the user/group IDs of www-data inside the image to match the ID of the
# developer's user on the host machine. This allows Composer to create files
# owned by www-data inside the container, while keeping those files editable by
# the developer outside of the container.
# This defaults to 1000, based on the assumption that the developer is running
# as UID 1000 on the host machine. It can be overridden at image build time with:
# --build-arg WWW_DATA_ID=$(id -u)
ARG WWW_DATA_ID=1000
RUN usermod -u ${WWW_DATA_ID} www-data && groupmod -g ${WWW_DATA_ID} www-data

# Install Xdebug.
RUN yes | pecl install xdebug-2.9.8 \
	  && echo "zend_extension=$(find /usr/local/lib/php/extensions/ -name xdebug.so)" > /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.remote_enable=on" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.remote_autostart=off" >> /usr/local/etc/php/conf.d/xdebug.ini

# Install git and unzip for use by Drush Make.
RUN apt-get update && apt-get install -y git unzip

# Install Drush 8 with the phar file.
ENV DRUSH_VERSION 8.3.5
RUN curl -fsSL -o /usr/local/bin/drush.phar "https://github.com/drush-ops/drush/releases/download/${DRUSH_VERSION}/drush.phar" \
  && chmod +x /usr/local/bin/drush.phar \
  && ln -s /usr/local/bin/drush.phar /usr/local/bin/drush \
  && drush core-status

# Install mariadb-client so Drush can connect to the database.
RUN apt-get update && apt-get install -y mariadb-client

# Build the farmOS repository in /tmp/farmOS.
RUN git clone --branch ${FARMOS_BRANCH} ${FARMOS_REPO} /tmp/farmOS && \
  sed -i 's@http://git.drupal.org/project/farm.git@'"${FARMOS_REPO}"'@g' /tmp/farmOS/build-farm.make && \
  sed -i 's/7.x-1.x/'"${FARMOS_BRANCH}"'/g' /tmp/farmOS/build-farm.make && \
  drush make --working-copy --no-gitinfofile /tmp/farmOS/build-farm.make /tmp/www && \
  chown -R www-data:www-data /tmp/www

# Builds a custom farmos image that includes the patch to the
# restws module that allows for query parameters to use relational
# operations (e.g. [le], [gt], etc)  Note that the files copied
# below are based on the patch: https://www.drupal.org/project/restws/issues/1910294
# But have also been modified locally to fix a few additional issues.

# Install the files for the restws module that allows date range searches via the API.
COPY restws/restws.entity.inc /var/www/html/profiles/farm/modules/contrib/restws/restws.entity.inc
COPY restws/restws.module /var/www/html/profiles/farm/modules/contrib/restws/restws.module
COPY restws/restws.test /var/www/html/profiles/farm/modules/contrib/restws/restws.test

# Set the entrypoint.
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod u+x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["apache2-foreground"]
