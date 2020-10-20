#This script will revert the farmos version to 1.5
#The container needs to be running


curLoc=$(pwd)
name=$(basename $curLoc)


echo "Removing previous files"
sudo docker exec -it ${name}_www_1 rm -R /var/www/html/


echo "Downloading 1.5"
sudo docker exec -it ${name}_www_1 curl -SL "http://ftp.drupal.org/files/projects/farm-7.x-1.5-core.tar.gz" -o /tmp/farm-7.x-1.5-core.tar.gz 

echo "Unzipping"
sudo docker exec -it ${name}_www_1  tar -xvzf /tmp/farm-7.x-1.5-core.tar.gz -C /var/www/html/ --strip-components=1
sudo docker exec -it ${name}_www_1  chown -R www-data:www-data /var/www/html