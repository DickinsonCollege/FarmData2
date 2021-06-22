#!/usr/bin/python3

# Creates the Planting assets and Seeding logs for all of the seedings
# in the sample data.
# The data for the plantings and seeding is in the sampleData/cropFamilies.csv file.

import requests
from requests.auth import HTTPBasicAuth
from time import time
import json
from csv import reader
from utils import *
import sys

# Get the id of the Farm Log Categories Vocabulary so we can add Direct and Tray seedings.
logCatsVocabID = getVocabularyID('farm_log_categories')

# Get lists of all of the recognized crops and fields for validation.
cropMap = getCropMap()
areaMap = getAreaMap()

def main():
    print("Adding Seedings...")

    # Add the Log Categories
    deleteSeedingCategory("Direct Seedings")
    deleteSeedingCategory("Tray Seedings")
    directSeedingCatID = addSeedingCategory("Direct Seedings")
    traySeedingCatID = addSeedingCategory("Tray Seedings")

    # Delete any Plantings or Seedings that exist.
    deleteAllAssets('http://localhost/farm_asset.json?type=planting')
    

    # Add the Seeding Data
    addDirectSeedingData()


    print("Seedings added.")

def addDirectSeedingData():
    with open('sampleData/directSeeding.csv', 'r') as dsFile:
        ds_reader = reader(decomment(dsFile))
        line=1
        for row in ds_reader:
            validateRow(line, row)
            plantingID = addPlanting(row)
            addSeeding(row, plantingID)
            line+=1

def validateRow(line, row):
    crop = row[2]
    row[2] = validateCrop(line, crop, cropMap)
    area = row[3]
    row[3] = validateArea(line, area, areaMap)
    
def addPlanting(row):
    planting = {
        "name": row[1] + " " + row[2] + " " + row[3],
        "type": "planting",
        "crop": [{
            "id": cropMap[row[2]],
            "resource": "taxonomy_term"
        }],
        "uid": {
            "id": 7,
            "resource": "user"
        }
    }

    response = requests.post('http://localhost/farm_asset', 
        json=planting, auth=HTTPBasicAuth(user, passwd))

    if(response.status_code == 201):
        plantingID = response.json()['id']
        print("Created Planting: " + planting['name'] + " with id " + plantingID)
        return plantingID
    else:
        print("Error Creating Planting: " + planting['name'])
        sys.exit(-1)

def addSeeding(row, plantingID):
    #print("Seeding")
    return

def deleteSeedingCategory(category): 
    response = requests.get("http://localhost/taxonomy_term.json?&name=" + category
    , auth=HTTPBasicAuth(user, passwd))
    catJson = response.json()['list']
    if len(catJson) > 0:
        catJson = catJson[0]
        catID = catJson['tid']
        response = requests.delete("http://localhost/taxonomy_term/" + catID, 
            auth=HTTPBasicAuth(user, passwd))

        if(response.status_code == 200):
            print("Deleted Log Category: " + catJson['name'] + " with id " + catID)

def addSeedingCategory(category):
    # Get the id of the Planting Farm Log Category so that we can use it
    # as a parent for the Direct and Tray seedings.
    response = requests.get("http://localhost/taxonomy_term.json?name=Plantings", 
        auth=HTTPBasicAuth(user, passwd))
    plantingCatVocabID = response.json()['list'][0]['tid']

    cat = {
        "name": category,
        "vocabulary": logCatsVocabID,
        "parent": [{
            "id": plantingCatVocabID,
            "resource": "taxonomy_term"
        }],
    }
    response = requests.post('http://localhost/taxonomy_term', 
        json=cat, auth=HTTPBasicAuth(user, passwd))

    if(response.status_code == 201):
        catID = response.json()['id']
        print("Created Category: " + cat['name'] + " with id " + catID)
        return catID
    else:
        print("Error Creating Category: " + cat['name'])
        sys.exit(-1)




if __name__ == "__main__":
    main()
