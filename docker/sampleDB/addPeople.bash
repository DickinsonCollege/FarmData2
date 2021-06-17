# Adds all of the FarmData2 users to the sample database.

echo "Adding 'People' and assigning Roles..."
# Assign roles to existing admin user.
docker exec -it fd2_farmdata2 drush urol "Farm Manager" --name="admin"
docker exec -it fd2_farmdata2 drush urol "Farm Worker" --name="admin"
docker exec -it fd2_farmdata2 drush urol "Farm Viewer" --name="admin"
echo ""

# Create the farm managers
for i in {1..2}
do
    docker exec -it fd2_farmdata2 drush user-create "manager$i" --password="farmdata2"
    docker exec -it fd2_farmdata2 drush urol "Farm Manager" --name="manager$i"
    docker exec -it fd2_farmdata2 drush urol "Farm Worker" --name="manager$i"
    docker exec -it fd2_farmdata2 drush urol "Farm Viewer" --name="manager$i"
    echo ""
done

# Create the farm workers
for i in {1..5}
do
    docker exec -it fd2_farmdata2 drush user-create "worker$i" --password="farmdata2"
    docker exec -it fd2_farmdata2 drush urol "Farm Worker" --name="worker$i"
    docker exec -it fd2_farmdata2 drush urol "Farm Viewer" --name="worker$i"
    echo ""
done

# Create the guest
docker exec -it fd2_farmdata2 drush user-create "guest" --password="farmdata2"
docker exec -it fd2_farmdata2 drush urol "Farm Viewer" --name="guest"
echo ""

# Create the user that will be allowed to login with basic authentication
# This username must begin with restws (see: https://www.drupal.org/node/3016570)
docker exec -it fd2_farmdata2 drush user-create "restws1" --password="farmdata2"
docker exec -it fd2_farmdata2 drush urol "Farm Manager" --name="restws1"
docker exec -it fd2_farmdata2 drush urol "Farm Worker" --name="restws1"
docker exec -it fd2_farmdata2 drush urol "Farm Viewer" --name="restws1"
echo ""

echo "'People' created and Roles assigned."