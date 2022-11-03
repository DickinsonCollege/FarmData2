#!/usr/bin/python3

# Deletes all of the terms in the Crop Families
# and Crops/Varieties vocabularies.

from utils import *
import os

# Get the hostname of the farmOS server.
host = os.getenv('FD2_HOST')

print("Deleting Crops...")

# Note: Must delete crops before the families because the crops
# reference the families.
deleteAllVocabTerms("http://" + host + "/taxonomy_term.json?bundle=farm_crops")
deleteAllVocabTerms("http://" + host + "/taxonomy_term.json?bundle=farm_crop_families")

print("Crops Deleted.")
