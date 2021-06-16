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
COPY restws/restws.entity.inc /var/www/html/profiles/farm/modules/contrib/restws/restws.entity.inc
COPY restws/restws.module /var/www/html/profiles/farm/modules/contrib/restws/restws.module
COPY restws/restws.test /var/www/html/profiles/farm/modules/contrib/restws/restws.test
