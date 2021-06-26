#!/usr/bin/python3

# Creates the Farm Quantity Units vocabulary used by the FarmData2 sample database.
# The units are defined in the sampleData/units.csv file.

import requests
from requests.auth import HTTPBasicAuth
import json
from csv import reader
from utils import *
import sys

def main():
    print("Adding Farm Quantity Units...")

    # Get the id of the Farm Units Vocabulary so we can add the units to it.
    unitsVocabID = getVocabularyID('farm_quantity_units')

    # Add all of the areas indicated in the sampleData/units.csv file.
    with open('sampleData/units.csv', 'r') as unitsFile:
        units_reader = reader(decomment(unitsFile))
        for row in units_reader:
            if row[0] != '':
                unit = {
                    "name": row[0],
                    "vocabulary": unitsVocabID
                }
                parentUnitID = addVocabTerm(unit)
            else:
                unit = {
                    "name": row[1],
                    "vocabulary": unitsVocabID,
                    "parent": [{
                        "id": parentUnitID,
                        "resource": "taxonomy_term"
                    }],
                }
                childAreaID = addVocabTerm(unit)

    print("Farm Quantity Units added.")



if __name__ == "__main__":
    main()