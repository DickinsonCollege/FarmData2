#!/bin/bash

# This script builds a sample database for development and
# testing of FarmData2.  The data is anonymized data from
# the Dickinson College farm.

# The build starts from an empty database and adds all of the
# uses, terms and data that make up the sample database.
# It can be reconstructed at any time by running this script.

echo "Switching to empty db image..."
cd ..
./fd2-down.bash
sudo rm -rf db
tar -xjf db.empty.tar.bz2
./fd2-up.bash
cd sampleDB
echo "Switched to empty db image."

echo "Setting farm info..."
docker exec -it fd2_farmdata2 drush vset site_name "Sample Farm"
docker exec -it fd2_farmdata2 drush vset site_slogan "Farm with sample data for development and testing."
echo "Set."

echo "Enabling restws basic authentication..."
docker exec -it fd2_farmdata2 drush en restws_basic_auth -y
echo "restws basic authentication enabled."

echo "Enabling FarmData2 modules..."
docker exec -it fd2_farmdata2 drush en fd2_example -y
docker exec -it fd2_farmdata2 drush en fd2_barn_kit -y
docker exec -it fd2_farmdata2 drush en fd2_field_kit -y
echo "Enabled."

# Create the 'people' (i.e. users) in the sample FarmData2 database.
source ./addPeople.bash

# Create the vocabularies
  # Add the farm areas (fields, greenhouses, beds)
  ./addAreas.py

  exit()
  
  # Add the crop families and crops.
  ./addCrops.py
  # Add the units used for quantities
  ./addUnits.py

# Add the data
  # Add plantings and seedings that create them.
  ./addDirectSeedings.py
  ./addTraySeedings.py
  

echo "Compressing the sample database..."
cd ..
rm -f db.sample.tar.bz2
docker exec -it fd2_farmdata2 drush cc all
sudo tar cjvf db.sample.tar.bz2 db
cd sampleDB
echo "Compressed the sample database."