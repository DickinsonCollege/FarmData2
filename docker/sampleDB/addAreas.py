#!/usr/bin/python3

# Creates the Farm Area vocabulary used by the FarmData2 sample database.
# The areas are defined in the sampleData/areas.csv file.

import requests
from requests.auth import HTTPBasicAuth
import json
from csv import reader
from utils import *
import sys

# Get the id of the Farm Areas Vocabulary so we can add the areas to it.
response = requests.get("http://localhost/taxonomy_vocabulary.json?machine_name=farm_areas", auth=HTTPBasicAuth(user, passwd))
areasVocabID = response.json()['list'][0]['vid']

def main():
    print("Adding Farm Areas...")
    # Delete any areas that exist in the database.
    # Call twice because delete of parent areas fail until children are deleted.
    deleteAllAreas()
    deleteAllAreas()

    # Add all of the areas indicated in the sampleData/areas.csv file.
    weight=1
    with open('sampleData/areas.csv', 'r') as areasFile:
        areas_reader = reader(decomment(areasFile))
        for row in areas_reader:
            if row[0] != '':
                parentAreaID = addParentArea(row, weight)
            else:
                childAreaID = addChildArea(row, parentAreaID, weight)

            weight+=1

    print("Farm Areas added.")

def deleteAllAreas(): 
    response = requests.get("http://localhost/taxonomy_term.json?bundle=farm_areas", 
        auth=HTTPBasicAuth(user, passwd))
    areasJson = response.json()
    for area in areasJson['list']:
        areaID = area['tid']
        response = requests.delete("http://localhost/taxonomy_term/" + areaID, 
            auth=HTTPBasicAuth(user, passwd))

        if(response.status_code == 200):
            print("Deleted: " + area['area_type'] + " " + area['name'] + " with id " + areaID)

def addParentArea(row, weight):
    area = {
        "name": row[0],
        "area_type": row[1],
        "description": row[2],
        "vocabulary": areasVocabID,
        "weight": weight,
    }
    response = requests.post('http://localhost/taxonomy_term', 
        json=area, auth=HTTPBasicAuth(user, passwd))

    if(response.status_code == 201):
        areaID = response.json()['id']
        print("Created Parent Area: " + area['area_type'] + " " + area['name'] + " with id " + areaID)
        return areaID
    else:
        print("Error Creating: " + area['area_type'] + " " + area['name'])
        sys.exit(-1)

def addChildArea(row, parentID, weight):
    area = {
        "name": row[1],
        "area_type": row[2],
        "description": row[3],
        "vocabulary": areasVocabID,
        "parent": [{
            "id": parentID,
            "resource": "taxonomy_term"
        }],
        "weight": weight,
    }
    response = requests.post('http://localhost/taxonomy_term', 
        json=area, auth=HTTPBasicAuth(user, passwd))

    if(response.status_code == 201):
        areaID = response.json()['id']
        print("  Created Child Area: " + area['area_type'] + " " + area['name'] + " with id " + areaID)
        return areaID
    else:
        print("  Error Creating Child Area: " + area['area_type'] + " " + area['name'])
        sys.exit(-1)


if __name__ == "__main__":
    main()