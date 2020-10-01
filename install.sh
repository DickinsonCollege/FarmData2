
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
