FROM farmos/farmos:dev

# Builds a custom farmos image that includes the patch to the
# restws module that allows for query parameters to use relational
# operations (e.g. [le], [gt], etc)  Note that the files copied
# below are based on the patch: https://www.drupal.org/project/restws/issues/1910294
# But have also been modified locally to fix a few additional issues.

# NOTE: If changes are made here that require a new image
# update the tag in docker-compose.yml for force the rebuild
# when main is updated.

# Install the files for the restws module that allows date range searches via the API.
COPY restws.entity.inc /var/www/html/profiles/farm/modules/contrib/restws/restws.entity.inc
COPY restws.module /var/www/html/profiles/farm/modules/contrib/restws/restws.module
COPY restws.test /var/www/html/profiles/farm/modules/contrib/restws/restws.test

# Install the files for the taxonomy_csv that supports csv imports to vocabularies.
COPY taxonomy_csv-7.x-5.11.tar.gz /var/www/html/profiles/farm/modules/contrib/taxonomy_csv-7.x-5.11.tar.gz
RUN cd /var/www/html/profiles/farm/modules/contrib && \
    tar -xvf taxonomy_csv-7.x-5.11.tar.gz && \
    rm taxonomy_csv-7.x-5.11.tar.gz
