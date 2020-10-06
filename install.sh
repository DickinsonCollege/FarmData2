
#save the current folder name (which is the same as the docker container name)
curLoc=$(pwd)
name=$(basename $curLoc)


#Set temp path
sudo docker exec -it ${name}_www_1 drush variable-set file_temporary_path sites/default/tmp

#Set private path
sudo docker exec -it ${name}_www_1 drush vset file_private_path sites/default/files

# move custom modules into correct folder
cp -R demoData/custommodules/* www/sites/all/modules/

#Enable egg module
sudo docker exec -it ${name}_www_1 drush --yes en farm_eggs

#import group list
sudo docker exec -it ${name}_www_1 drush feeds-import farm_asset_group --file=/demoData/2018uploads/Assets/farm_asset_groups.csv --yes

#import fruit plantings
sudo docker exec -it ${name}_www_1 drush feeds-import farm_asset_planting --file=/demoData/2018uploads/Assets/Planting/farm_asset_plantingFRUIT2018.csv --yes


#add user admin
sudo docker exec -it ${name}_www_1 drush user-create admin --password="farmdata2"

#give admin role "Farm Manager"
sudo docker exec -it ${name}_www_1 drush urol "Farm Manager" --name=admin

# add user worker1
sudo docker exec -it ${name}_www_1 drush user-create worker1 --password="farmdata2"

#give worker1 role "Farm Worker"
sudo docker exec -it ${name}_www_1 drush urol "Farm Worker" --name=worker1

#upload logs for worker1
sudo docker exec -it ${name}_www_1 drush feeds-import log_farm_harvest --file=/demoData/2018uploads/Logs/Harvests/log_farm_harvestworker12018.csv


