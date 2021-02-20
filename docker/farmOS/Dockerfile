FROM farmos/farmos:dev

# Builds a custom farmos image that includes the patch to the
# restws module that allows for query parameters to use relational
# operations (e.g. [le], [gt], etc)  Note that the .patch file used
# has been modified locally and differs from the one on the Drupal 
# site at: https://www.drupal.org/project/restws/issues/1910294

# NOTE: If changes are made here that require a new image
# update the tag in docker-compose.yml for force the rebuild
# when main is updated.

COPY ability_to_filter_with-1910294.patch /var/www/html/profiles/farm/modules/contrib/restws/ability_to_filter_with-1910294.patch

WORKDIR /var/www/html/profiles/farm/modules/contrib/restws

RUN patch < ability_to_filter_with-1910294.patch && \
    drush cc all

WORKDIR /var/www/html/
