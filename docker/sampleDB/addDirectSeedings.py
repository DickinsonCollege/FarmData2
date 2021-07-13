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

# Get lists of all of the recognized crops, fields and users for validation.
cropMap = getCropMap()
areaMap = getAreaMap()
userMap = getUserMap()

# Get the term IDs that are needed for quantities.
rowFtID = getTermID("ROW FEET")
rowsID = getTermID("ROWS/BED")
hoursID = getTermID("HOURS")
peopleID = getTermID("PEOPLE")

def main():
    print("Adding Direct Seedings...")

    # Add the Log Category
    directSeedingCatID = addSeedingCategory("Direct Seedings")

    # Add the Seeding Data
    with open('sampleData/directSeedings.csv', 'r') as dsFile:
        ds_reader = reader(decomment(dsFile))
        line=1
        for row in ds_reader:
            validateRow(line, row)
            plantingID = addPlanting(row)
            addSeedings(row, plantingID, directSeedingCatID)
            line+=1
    
    print("Direct Seedings added.")

def validateRow(line, row):
    crop = row[2]
    row[2] = validateCrop(line, crop, cropMap)
    area = row[3]
    row[3] = validateArea(line, area, areaMap)
    user = row[11]
    row[11] = validateUser(line, user, userMap)
    
def addPlanting(row):
    planting = {
        "name": row[1] + " " + row[2] + " " + row[3],
        "type": "planting",
        "crop": [{
            "id": cropMap[row[2]],
            "resource": "taxonomy_term"
        }],
        "created": YYYYMMDDtoTimestamp(row[1]),
        "uid": {
            "id": userMap[row[11]],
            "resource": "user"
        }
    }
    return addAsset(planting)

# FarmData comments include information about multiple seedings
# Split each into a different seeding log and associate
# them with the same planting.
def addSeedings(row, plantingID, seedingTypeID):
    seedings = row[9].split(';')
    seedingCount = 0
    comment = ""
    for seeding in seedings:
        if (seeding.startswith('Seed Code:')):
            seedingCount+=1
            details = seeding.split(' - ')

            for i in range(0, len(details), 2):
                seedCode = details[i][11:].strip()

                if ('bed feet' not in details[i+1]):
                    print('Not bed feet!!!')
                    sys.exit(-1)

                bedfeet = details[i+1][:details[i+1].index(' ')].strip()
                rowfeet = str(int(float(bedfeet) * int(row[5])))

                #print("***" + seedCode + " *** " + rowfeet)
                #print("***" + comment)

                row[6] = rowfeet
                row.append(seedCode)    # row[15]
                row.append(comment)     # row[16]
                #comment = ""

                addSeeding(row, plantingID, seedingTypeID)

                row = row[:len(row)-2]  # take last two values off again.
        else:
            comment = comment + "<br>" + seeding

    if (seedingCount < 1):
        print("No seeding data for this record")
        sys.exit(-1)

 
def addSeeding(row, plantingID, seedingTypeID):
    seeding = {
        "name": row[1] + " " + row[2] + " " + row[3],
        "type": "farm_seeding",
        "timestamp": YYYYMMDDtoTimestamp(row[1]),
        "done": "1",  # any seeding recorded is done.
        "notes": {
            "value": row[16],
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
                "id": areaMap[row[3]],
                "resource": "taxonomy_term"
            }]
        },
        "quantity": [
            {
                "measure": "length", 
                "value": row[6],  # total row feet
                "unit": {
                    "id": rowFtID, 
                    "resource": "taxonomy_term"
                },
                "label": "Amount planted"
            },
            {
                "measure": "ratio", 
                "value": row[5],  # rows per bed
                                  # Bed feet = row feet / rows/bed
                "unit": {
                    "id": rowsID,
                    "resource": "taxonomy_term"
                },
                "label": "Rows/Bed"
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
        "created": YYYYMMDDtoTimestamp(row[1]),
        "uid": {
            "id": userMap[row[11]],
            "resource": "user"
        },
        "log_owner": [{
            "id": userMap[row[11]],
            "resource": "user"
        }],
        "lot_number": row[15],
        "data": json.dumps({ 
            "crop_tid": cropMap[row[2]] 
        })
    }

    return addLog(seeding)

if __name__ == "__main__":
    main()
