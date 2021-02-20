FROM farmos/farmos:dev

# Build a custom farmos image that includes the patch to the
# restws module that allows for query parameters to use relational
# operations (e.g. [le], [gt], etc)  Note that the .patch file used
# has been modified locally and differs from the one on the Drupal 
# site at: https://www.drupal.org/project/restws/issues/1910294

COPY ability_to_filter_with-1910294.patch /var/www/html/profiles/farm/modules/contrib/restws/ability_to_filter_with-1910294.patch

WORKDIR /var/www/html/profiles/farm/modules/contrib/restws

RUN patch < ability_to_filter_with-1910294.patch && \
    drush cc all

WORKDIR /var/www/
