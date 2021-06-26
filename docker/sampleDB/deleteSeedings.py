#!/usr/bin/python3

# Deletes all of the Planting assets and Seeding logs.

from utils import *

def main():

    print("Deleting Direct and Tray Seedings...")

    # Delete any seedings that exist.
    deleteAllLogs('http://localhost/log.json?type=farm_seeding')

    # Delete any Plantings that exist.
    deleteAllAssets('http://localhost/farm_asset.json?type=planting')

    # Delete the seeding categories that were added.
    deleteSeedingCategory("Direct Seedings")
    deleteSeedingCategory("Tray Seedings")

    print("Direct and Tray Seedings deleted.")

def deleteSeedingCategory(category): 
    response = requests.get("http://localhost/taxonomy_term.json?&name=" + category
    , auth=HTTPBasicAuth(user, passwd))
    catJson = response.json()['list']
    if (len(catJson) > 0):
        catID = catJson[0]['tid']
        catName = catJson[0]['name']
        deleteVocabTerm(catID, catName)

if __name__ == "__main__":
    main()
