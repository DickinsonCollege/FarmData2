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
areasVocabID = getVocabularyID('farm_areas')

def main():
    print("Adding Areas...")

    # Add all of the areas indicated in the sampleData/areas.csv file.
    weight=1
    with open('sampleData/areas.csv', 'r') as areasFile:
        areas_reader = reader(decomment(areasFile))
        for row in areas_reader:
            if row[0] != '':
                area = {
                    "name": row[0],
                    "area_type": row[1],
                    "description": row[2],
                    "vocabulary": areasVocabID,
                    "weight": weight,
                }
                parentAreaID = addVocabTerm(area)
            else:
                area = {
                    "name": row[1],
                    "area_type": row[2],
                    "description": row[3],
                    "vocabulary": areasVocabID,
                    "parent": [{
                        "id": parentAreaID,
                        "resource": "taxonomy_term"
                    }],
                    "weight": weight,
                }
                childAreaID = addVocabTerm(area)

            weight+=1

    print("Areas added.")

if __name__ == "__main__":
    main()