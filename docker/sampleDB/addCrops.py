#!/usr/bin/python3

# Creates the Crop Families and Crops/Varieties vocabularies used 
# by the FarmData2 sample database.
# The families and crops are defined in the sampleData/cropFamilies.csv file.

import requests
from requests.auth import HTTPBasicAuth
import json
from csv import reader
from utils import *
import sys

def main():
    print("Adding Crops...")

    # Get the id of the Farm Crop Families Vocabulary so we can add the areas to it.
    cropFamVocabID = getVocabularyID("farm_crop_families")

    # Get the id of the Farm Crops Vocabulary so we can add the areas to it.
    cropVocabID = getVocabularyID("farm_crops")

    familyWeight=1
    cropWeight=1

    with open('sampleData/crops.csv', 'r') as cropsFile:
        crops_reader = reader(decomment(cropsFile))
        for row in crops_reader:
            if row[0] != '':
                family = {
                    "name": row[0],
                    "vocabulary": cropFamVocabID,
                    "weight": familyWeight,
                }
                familyID = addVocabTerm(family)
                familyWeight+=1
            elif row[1] != '':
                crop = {
                    "name": row[1],
                    "vocabulary": cropVocabID,
                    "crop_family": {
                        "id": familyID,
                        "resource": "taxonomy_term"
                    },
                    #"weight": cropWeight,   # Omit to use alphabetical order in farmOS
                }
                parentCropID = addVocabTerm(crop)
                parentCropName = row[1]
                cropWeight+=1
            else:
                crop = {
                    "name": parentCropName + "-" + row[2],
                    "vocabulary": cropVocabID,
                    "parent": [{
                        "id": parentCropID,
                        "resource": "taxonomy_term"
                    }],
                    "crop_family": {    # This is not inherited from parent.
                        "id": familyID,
                        "resource": "taxonomy_term"
                    },
                    #"weight": cropWeight,   # Omit to use alphabetical order in farmOS
                }
                childCropID = addVocabTerm(crop)
                cropWeight+=1

    print("Crops added.")

if __name__ == "__main__":
    main()