#!/usr/bin/python3

# Creates the Crop Families and Crops/Varieties vocabularies used 
# by the FarmData2 sample database.
# The families and crops are defined in the sampleData/cropFamilies.csv file.

import requests
from requests.auth import HTTPBasicAuth
from time import time
import json
from csv import reader
from utils import *
import sys

# Get the id of the Farm Crop Families Vocabulary so we can add the areas to it.
response = requests.get("http://localhost/taxonomy_vocabulary.json?machine_name=farm_crop_families", auth=HTTPBasicAuth(user, passwd))
cropFamVocabID = response.json()['list'][0]['vid']

# Get the id of the Farm Crops Vocabulary so we can add the areas to it.
response = requests.get("http://localhost/taxonomy_vocabulary.json?machine_name=farm_crops", auth=HTTPBasicAuth(user, passwd))
cropVocabID = response.json()['list'][0]['vid']

def main():
    print("Adding Farm Crop Families...")

    deleteCropFamilies()
    deleteCrops()
    deleteCrops() # call twice to delete parent crops.

    familyWeight=1
    cropWeight=1

    with open('sampleData/crops.csv', 'r') as cropsFile:
        crops_reader = reader(decomment(cropsFile))
        for row in crops_reader:
            if row[0] != '':
                familyID = addCropFamily(row, familyWeight)
                familyWeight+=1
            elif row[1] != '':
                parentCropID = addParentCrop(row, familyID, cropWeight)
                cropWeight+=1
            else:
                childCropID = addChildCrop(row, parentCropID, familyID, cropWeight)
                cropWeight+=1

    print("Farm Crop Families added.")

def deleteCropFamilies():
    response = requests.get("http://localhost/taxonomy_term.json?bundle=farm_crop_families", 
        auth=HTTPBasicAuth(user, passwd))
    familiesJson = response.json()
    for family in familiesJson['list']:
        familyID = family['tid']
        response = requests.delete("http://localhost/taxonomy_term/" + familyID, 
            auth=HTTPBasicAuth(user, passwd))

        if(response.status_code == 200):
            print("Deleted Crop Family: " + family['name'] + " with id " + familyID)

def addCropFamily(row, familyWeight):
    family = {
        "name": row[0],
        "vocabulary": cropFamVocabID,
        "weight": familyWeight,
    }

    response = requests.post('http://localhost/taxonomy_term', 
        json=family, auth=HTTPBasicAuth(user, passwd))

    if(response.status_code == 201):
        familyID = response.json()['id']
        print("Created Crop Family: " + family['name'] + " with id " + familyID)
        return familyID
    else:
        print("Error Creating Crop Family: " + family['name'])
        sys.exit(-1)

def deleteCrops():
    response = requests.get("http://localhost/taxonomy_term.json?bundle=farm_crops", 
        auth=HTTPBasicAuth(user, passwd))
    cropsJson = response.json()
    for crop in cropsJson['list']:
        cropID = crop['tid']
        response = requests.delete("http://localhost/taxonomy_term/" + cropID, 
            auth=HTTPBasicAuth(user, passwd))

        if(response.status_code == 200):
            print("Deleted Crop: " + crop['name'] + " with id " + cropID)

def addParentCrop(row, familyID, cropWeight):
    crop = {
        "name": row[1],
        "vocabulary": cropVocabID,
        "crop_family": {
            "id": familyID,
            "resource": "taxonomy_term"
        },
        #"weight": cropWeight,   # Omit to use alphabetical order in farmOS
    }

    response = requests.post('http://localhost/taxonomy_term', 
        json=crop, auth=HTTPBasicAuth(user, passwd))

    if(response.status_code == 201):
        cropID = response.json()['id']
        print("Created Parent Crop: " + crop['name'] + " with id " + cropID)
        return cropID
    else:
        print("Error Creating Parent Crop: " + crop['name'])
        sys.exit(-1)

def addChildCrop(row, parentCropID, familyID, cropWeight):
    crop = {
        "name": row[2],
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

    response = requests.post('http://localhost/taxonomy_term', 
        json=crop, auth=HTTPBasicAuth(user, passwd))

    if(response.status_code == 201):
        cropID = response.json()['id']
        print("Created Child Crop: " + crop['name'] + " with id " + cropID)
        return cropID
    else:
        print("Error Creating Child Crop: " + crop['name'])
        sys.exit(-1)

if __name__ == "__main__":
    main()