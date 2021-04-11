
newDrupalAdmin=qwer
newFarmdata2db=asdfx
newMariadbRoot=zxcv




rm temp.php 
docker exec -it fd2_farmdata2 sed "s/'password' => '.*'/'password' => '$newFarmdata2db'/" /var/www/html/sites/default/settings.php >> temp.php
docker exec -it fd2_farmdata2 rm /var/www/html/sites/default/settings2.php
docker cp temp.php fd2_farmdata2:/var/www/html/sites/default/settings2.php
docker exec -it fd2_farmdata2 cp /var/www/html/sites/default/settings2.php /var/www/html/sites/default/settings.php
docker exec -it fd2_mariadb mysql -u root -pfarm -e "alter user 'farmdata2db'@'%' identified by '$newFarmdata2db'"


docker exec -it fd2_mariadb mysql -u root -pfarm -e "alter user 'root'@'localhost' identified by '$newMariadbRoot'"
docker exec -it fd2_mariadb mysql -u root -pfarm -e "alter user 'root'@'%' identified by '$newMariadbRoot'"

docker exec -it fd2_farmdata2 drush upwd --password=$newDrupalAdmin admin
