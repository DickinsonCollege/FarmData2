#!/usr/bin/python3

# Deletes all of the Planting assets and Seeding logs.

from utils import *

def main():

    print("Deleting Direct and Tray Seedings...")

    # Delete any seedings that exist.
    deleteAllLogs('http://localhost/log.json?type=farm_seeding')

    # Delete any Plantings that exist.
    # Will not delete any Plantings associated with Transplant Logs
    # Those will be deleted by deleteTransplantings.py
    deleteAllAssets('http://localhost/farm_asset.json?type=planting')

    # Delete the seeding categories that were added.
    deleteSeedingCategory("Direct Seedings")
    deleteSeedingCategory("Tray Seedings")

    print("Direct and Tray Seedings deleted.")

if __name__ == "__main__":
    main()
