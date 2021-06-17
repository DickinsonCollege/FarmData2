#!/bin/bash

echo "Switching to empty db image..."
cd ..
./fd2-down.bash
sudo rm -rf db
tar -xjf db.empty.tar.bz2
./fd2-up.bash

echo "Adding 'People' and assigning Roles..."
# Assign roles to existing admin user.
sudo docker exec -it fd2_farmdata2 drush urol "Farm Manager" --name="admin"
sudo docker exec -it fd2_farmdata2 drush urol "Farm Worker" --name="admin"
sudo docker exec -it fd2_farmdata2 drush urol "Farm Viewer" --name="admin"
echo ""

# Create the farm managers
for i in {1..2}
do
    sudo docker exec -it fd2_farmdata2 drush user-create "manager$i" --password="farmdata2"
    sudo docker exec -it fd2_farmdata2 drush urol "Farm Manager" --name="manager$i"
    sudo docker exec -it fd2_farmdata2 drush urol "Farm Worker" --name="manager$i"
    sudo docker exec -it fd2_farmdata2 drush urol "Farm Viewer" --name="manager$i"
    echo ""
done

# Create the farm workers
for i in {1..5}
do
    sudo docker exec -it fd2_farmdata2 drush user-create "worker$i" --password="farmdata2"
    sudo docker exec -it fd2_farmdata2 drush urol "Farm Worker" --name="worker$i"
    sudo docker exec -it fd2_farmdata2 drush urol "Farm Viewer" --name="worker$i"
    echo ""
done

# Create the guest
sudo docker exec -it fd2_farmdata2 drush user-create "guest" --password="farmdata2"
sudo docker exec -it fd2_farmdata2 drush urol "Farm Viewer" --name="guest"
echo ""

echo "'People' created and Roles assigned."




echo "Compressing the sample database"
rm -f db.sample.tar.bz2
docker exec -it fd2_farmdata2 drush cc all
sudo tar cjvf db.sample.tar.bz2 db/