#!/usr/bin/python3

# Creates the Harvest logs for all of the harvests in the sample data.
# The data for the harvests is in the sampleData/harvests.csv file.

import requests
from requests.auth import HTTPBasicAuth
from time import time
import json
from csv import reader
from utils import *
import sys
import random

# Get lists of all of the recognized crops, fields and users for validation.
cropMap = getCropMap()
areaMap = getAreaMap()
userMap = getUserMap()
unitMap = getUnitsMap()
measureMap = getMeasuresMap()

# Get the term IDs that are needed for quantities.
hoursID = getTermID("HOURS")
peopleID = getTermID("PEOPLE")

def main():
    print("Adding Harvests...")

    # Add the Harvest Data
    with open('sampleData/harvests.csv', 'r') as hFile:
        h_reader = reader(decomment(hFile))
        line=1

        for row in h_reader:
            # Some harvests don't have matching plantings so need
            # to remap them in some way.
            patchRow(row)

            validateRow(line, row)

            plantingID = getPlanting(row)

            if (plantingID == -1):
                plantingID = getPlantingFromTransplanting(row)

            if (plantingID == -1):
                plantingID = getPlantingFromSeeding(row)

            if (plantingID == -1):
                print("no planting id for: " + row[3] + " " + row[5] + " " + row[4])
                sys.exit(-1)

            addHarvest(row, plantingID)
            line+=1

    print("Harvests added.")

def addHarvest(row, plantingID):
    harvest = {
        "quantity": [
            {
                "measure": measureMap[row[7]],
                "value": row[6],
                "unit": {
                    "id": unitMap[row[7]],
                    "resource": "taxonomy_term"
                },
                "label": "Harvest"
            },
            {
                "measure": "time", 
                "value": row[8],  # hours worked
                "unit": {
                    "id": hoursID,
                    "resource": "taxonomy_term"
                },
                "label": "Labor"
            },
            {
                "measure": "count", 
                "value": 1,  # number of people (x Time = Total Time)
                             # default 1 here because FarmData didn't record this.
                             # Workers x Labor gives total time
                "unit": {
                    "id": peopleID,
                    "resource": "taxonomy_term"
                },
                "label": "Workers"
            },
        ],
        "name": row[3] + " " + row[5] + " " + row[4],
        "type": "farm_harvest",
        "timestamp": YYYYMMDDtoTimestamp(row[3]),
        "done": "1",
        "asset": [
            {
                "id": plantingID,
                "resource": "farm_asset"
            }
        ],
        "uid": {
            "id": userMap[row[1]],
            "resource": "user"
        },
        "log_owner": [
            {
                "id": userMap[row[1]],
                "resource": "user"
            }
        ],
        "notes": {
            "value": row[9],
            "format": "farm_format"
        },
        "area": [
            {
                "id": areaMap[row[4]],
                "resource": "taxonomy_term",
            }
        ]
    }

    return addLog(harvest)

def patchRow(row):
    if (row[5] == 'KALE' and row[4] == 'K'):
        # Remap the KALE harvests to areas that had KALE planted in them.
        # Seems likely the seedings were never logged.
        row[4] = random.choice(["CHUAU-4","T", "O", "J", "Z", "W", "ALF-4"])
    elif (row[5] == 'BRUSSEL SPROUTS' and row[4] == 'K'):
        # Remap the BRUSSEL SPROUTS harvests to field J where they were
        # actually transplanted do.  Seems a likely data entry error.
        row[4] = "J"

def validateRow(line, row):
    user = row[1]
    row[1] = validateUser(line, user, userMap)
    area = row[4]
    row[4] = validateArea(line, area, areaMap)
    crop = row[5]
    row[5] = validateCrop(line, crop, cropMap)
    unit = row[7]
    row[7] = validateUnit(line, unit, unitMap)

def getPlanting(row):
    name = row[5] + " " + row[4]

    # Only look for plantings before the harvest.  Note: limiting the time frame
    # before the harvest didn't effectively reduce multiple matches so not bothering.
    # Note also there are a few plantings on the date of the harvest - planting must 
    # never have been entered and put in later so it could be harvested.  So use le 
    # in the searches to catch these.
    time = YYYYMMDDtoTimestamp(row[3])

    response = requests.get("http://localhost/farm_asset.json?type=planting&name[ct]=" + name 
        + "&created[le]=" + str(time),
        auth=HTTPBasicAuth(user, passwd))

    if (len(response.json()['list']) == 1):
        # Found matching planting.
        return response.json()['list'][0]['id']
    else:
        # Either 0 or multiple plantings match.
        return -1

def getPlantingFromTransplanting(row):
    name = row[5] + " " + row[4]
    time = YYYYMMDDtoTimestamp(row[3])
       
    response = requests.get("http://localhost/log.json?type=farm_transplanting&name[ct]=" + name
        + "&created[le]=" + str(time), 
        auth=HTTPBasicAuth(user, passwd))

    if (len(response.json()['list']) == 1):
        return response.json()['list'][0]['asset'][0]['id']
    elif (len(response.json()['list']) > 1):
        # multiple transplantings match so just pick one at random
        return random.choice(response.json()['list'])['asset'][0]['id']
    else:
        # No transplantings match
        return -1    

def getPlantingFromSeeding(row):
    name = row[5] + " " + row[4]
    time = YYYYMMDDtoTimestamp(row[3])
       
    response = requests.get("http://localhost/log.json?type=farm_seeding&name[ct]=" + name
        + "&created[le]=" + str(time), 
        auth=HTTPBasicAuth(user, passwd))

    if (len(response.json()['list']) == 1):
        return response.json()['list'][0]['asset'][0]['id']
    elif (len(response.json()['list']) > 1):
        # multiple plantings match so just pick one at random
        return random.choice(response.json()['list'])['asset'][0]['id']
    else:
        # No plantings match
        return -1    


if __name__ == "__main__":
    main()