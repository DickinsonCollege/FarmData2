#!/usr/bin/python3

# Creates the Transplanting logs for all of the transplantings in the sample data.
# The data for the transplantings is in the sampleData/transplantings.csv file.

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
rowFtID = getTermID("Row Feet")
rowsID = getTermID("Rows/Bed")
hoursID = getTermID("Hours")
peopleID = getTermID("People")

def main():
    print("Adding Transplantings...")

    # Add the Transplatings Data
    with open('sampleData/transplantings.csv', 'r') as tFile:
        t_reader = reader(decomment(tFile))
        line=1
        for row in t_reader:
            validateRow(line, row)
            plantingID = getPlanting(row)
            #addTransplanting(row, plantingID)
            line+=1

    print("Transplantings added.")

def validateRow(line, row):
    user = row[1]
    row[1] = validateUser(line, user, userMap)
    area = row[2]
    row[2] = validateArea(line, area, areaMap)
    crop = row[3]
    row[3] = validateCrop(line, crop, cropMap)

def getPlanting(row):
    name = row[4] + " " + row[3]
    response = requests.get("http://localhost/farm_asset.json?type=planting&name=" + name, 
        auth=HTTPBasicAuth(user, passwd))

    if (len(response.json()['list']) == 1):
        # Found matching planting.
        return response.json()['list'][0]['id']

    elif (len(response.json()['list']) == 0):
        # No matching planting.
        # So make a planting for it.
        if (row[4] != '0000-00-00'):
            print("Transplanting with a seeding date, but no seeding record.")
            print("Modify the record in transplantings.csv so the seeding date is 0000-00-00")
            sys.exit(-1)

        plantingID = addPlanting(row)
        return plantingID

    else:
        # More than one matching planting.
        # Need to have some way to match the transplant to the correct planting.
        # Didnt come up in the original sample data so it has been ignored for now.
        # May be an issue on a full FarmData data migration.
        print("Multiple plantings match: " + name)
        print("This situation is not currently handled.")
        sys.exit(-1)

# add a planting asset with date of the transplanting.
def addPlanting(row):

    # Most of these have a seeding date 0000-00-00
    # In that case we assume the crop arrived at the farm in a tray 
    # and thus was just transplanted without having a seeding date.
    # If there is a seeding date, there wasn't a record for it in the
    # seeding data so we'll treat it like a 0000-00-00.
    plantingDate = '0000-00-00'

    planting = {
        "name": plantingDate + " " + row[3] + " " + row[2],
        "type": "planting",
        "crop": [{
            "id": cropMap[row[3]],
            "resource": "taxonomy_term"
        }],
        "created": YYYYMMDDtoTimestamp(row[8]),
        "uid": {
            "id": userMap[row[1]],
            "resource": "user"
        }
    }
    return addAsset(planting)
    

if __name__ == "__main__":
    main()
