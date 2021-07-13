#!/usr/bin/python3

# Creates the Planting assets and Seeding logs for all of the 
# direct seedings in the sample data.
# The data for the plantings and seeding is in the sampleData/directSeedings.csv file.

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

# Get the term IDs that are needed for quantities.
seedsID = getTermID("SEEDS")
flatsID = getTermID("FLATS")
cellsPerFlatID = getTermID("CELLS/FLAT")
hoursID = getTermID("HOURS")
peopleID = getTermID("PEOPLE")

greenhouseIDs = []

def main():
    print("Adding Tray Seedings...")

    # ensure same random assignments if db is regeenrated.
    random.seed(1)  

    # Get a list of the greenhouse ID's to randomly place trays
    # because FarmData doesn't have the data.
    global greenhouseIDs
    greenhouseIDs = getGreenhouseIDs()

    # Add the Log Category
    traySeedingCatID = addSeedingCategory("Tray Seedings")

    # Add the Seeding Data
    with open('sampleData/traySeedings.csv', 'r') as tsFile:
        ts_reader = reader(decomment(tsFile))
        line=1
        for row in ts_reader:
            validateRow(line, row)
            plantingID = addPlanting(row)
            addSeedings(row, plantingID, traySeedingCatID)
            line+=1

    print("Tray Seedings added.")

def validateRow(line, row):
    user = row[1]
    row[1] = validateUser(line, user, userMap)
    crop = row[3]
    row[3] = validateCrop(line, crop, cropMap)
    
def addPlanting(row):
    planting = {
        "name": row[2] + " " + row[3],
        "type": "planting",
        "crop": [{
            "id": cropMap[row[3]],
            "resource": "taxonomy_term"
        }],
        "created": YYYYMMDDtoTimestamp(row[2]),
        "uid": {
            "id": userMap[row[1]],
            "resource": "user"
        }
    }
    return addAsset(planting)

# FarmData comments include information about multiple seedings
# Split each into a different seeding log and associate
# them with the same planting.
def addSeedings(row, plantingID, seedingTypeID):
    #print (row)
    seedings = row[7].split('seeds;')
    seedingCount = 0

    totalFlats = float(row[5])
    totalSeeds = int(row[4])
    if totalSeeds == 0:  
        # If seed count not given, assume one seed per tray cell.
        cellsPerFlat = int(row[6])
        totalSeeds = totalFlats*cellsPerFlat
   
    seedsPerFlat = totalSeeds/totalFlats 

    for seeding in seedings:
        if (seeding.startswith('Seed Code:')):
            #print(seeding)
            seedingCount+=1
            details = seeding.split(' - ')

            for i in range(0, len(details), 2):
                seedCode = details[i][11:].strip()
                seedCount = details[i+1][:details[i+1].index(' ')]

                #print(seedCode + " *** " + seedCount)

                row[4] = seedCount
                if seedCount == 0: 
                    # If seed counts are 0, ssume equally distributed across seedings.
                    seedCount = str(totalSeeds / len(seedings)) 

                row[7] = seedCode

                # Scale number of flats to account for multiple seedings in planting
                # Not rounding results in <500> response status.
                row[5] = str(round(int(seedCount) / seedsPerFlat,2))

                addSeeding(row, plantingID, seedingTypeID)
        else:
            print("Bad seed variety format")
            sys.exit(-1)

    if (seedingCount < 1):
        print("No seeding data for this record")
        sys.exit(-1)

def addSeeding(row, plantingID, seedingTypeID):

    # Pick some random values for things not in FarmData.
    randomHours = random.randrange(1,15, 1)/10.0  # 0.1...1.5 hours
    randomGreenhouseID = random.choice(greenhouseIDs)

    seeding = {
        "name": row[2] + " " + row[3],
        "type": "farm_seeding",
        "timestamp": YYYYMMDDtoTimestamp(row[2]),
        "done": "1",  # any seeding recorded is done.
        "notes": {
            "value": row[9],
            "format": "farm_format"
        },
        "asset": [{ 
            "id": plantingID,   # Associated planting
            "resource": "farm_asset"
        }],
        "log_category": [{
            "id": seedingTypeID,
            "resource": "taxonomy_term"
        }],
        "movement": {
            "area": [{
                "id": randomGreenhouseID,
                "resource": "taxonomy_term"
            }]
        },
        "quantity": [
            {
                "measure": "count", 
                "value": row[4],  # number of seed planted
                "unit": {
                    "id": seedsID, 
                    "resource": "taxonomy_term"
                },
                "label": "Seeds planted"
            },
            {
                "measure": "count", 
                "value": row[5],  # number of flats
                "unit": {
                    "id": flatsID, 
                    "resource": "taxonomy_term"
                },
                "label": "Flats used"
            },
            {
                "measure": "ratio", 
                "value": row[6],  # cells per flat
                "unit": {
                    "id": cellsPerFlatID,
                    "resource": "taxonomy_term"
                },
                "label": "Cells/Flat"
            },
            {
                "measure": "time", 
                "value": randomHours,  # hours worked
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
        "created": YYYYMMDDtoTimestamp(row[2]),
        "uid": {
            "id": userMap[row[1]],
            "resource": "user"
        },
        "log_owner": [{
            "id": userMap[row[1]],
            "resource": "user"
        }],
        "lot_number": row[7],
        "data": json.dumps({ 
            "crop_tid": cropMap[row[3]] 
        })
    }

    return addLog(seeding)

def getGreenhouseIDs():
    greenhouses = getAllPages("http://localhost/taxonomy_term.json?area_type=greenhouse")
    greenhouseList = []

    for greenhouse in greenhouses:
        id = greenhouse['tid']
        greenhouseList.append(id)

    return greenhouseList

if __name__ == "__main__":
    main()
