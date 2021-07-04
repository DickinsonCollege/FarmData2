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

# Get lists of all of the recognized crops, fields and users for validation.
unitsMap = getUnitsMap()

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

        line=1
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
                    "quantity_units": {
                        "id": unitsMap[validateUnit(line, row[2], unitsMap)],
                        "resource": "taxonomy_term"
                    },
                }

                # Add the conversions for the crop.
                crop['quantity'] = getConversions(row[3:], line)
                
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
                    "quantity_units": {
                        "id": unitsMap[validateUnit(line, row[3], unitsMap)],
                        "resource": "taxonomy_term"
                    },
                }

                crop['quantity'] = getConversions(row[4:], line)

                childCropID = addVocabTerm(crop)
                cropWeight+=1

            line+=1

    print("Crops added.")

def getConversions(row, line):
    conversions = []

    for i in range(0, len(row), 2):

        unit = getTerm(unitsMap[validateUnit(line, row[i], unitsMap)])
        measure = unit['parents_all'][len(unit['parents_all'])-1]['name'].lower()

        conversions.append(
            {
                "measure": measure, 
                "value": row[i+1],
                "unit": {
                    "id": unitsMap[validateUnit(line, row[i], unitsMap)], 
                    "resource": "taxonomy_term",
                },
            },
        )

    return conversions


if __name__ == "__main__":
    main()