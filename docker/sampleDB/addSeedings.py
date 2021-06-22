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
cropList = getCropList()
areaList = getAreaList()

def main():
    print("Adding Seedings...")

    # Add the Log Categories
    deleteSeedingCategory("Direct Seedings")
    deleteSeedingCategory("Tray Seedings")
    directSeedingCatID = addSeedingCategory("Direct Seedings")
    traySeedingCatID = addSeedingCategory("Tray Seedings")

    # Add the Seeding Data
    addDirectSeedingData()


    print("Seedings added.")

def addDirectSeedingData():
    with open('sampleData/directSeeding.csv', 'r') as dsFile:
        ds_reader = reader(decomment(dsFile))
        line=1
        for row in ds_reader:
            validateRow(line, row)
            addPlanting(row)
            addSeeding(row)
            line+=1

def validateRow(line, row):
    crop = row[2]
    validateCrop(line, crop, cropList)
    field = row[3]
    validateField(line, field, areaList)
    
def addPlanting(row):
   #print("Planting")
   return

def addSeeding(row):
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
