#!/usr/bin/python3

# Deletes all of the Transplanting logs and possibly the Planting assets.

# Most transplantings rely on existing Plantings from traySeedings
# By default those Plantings are not deleted.  
# This allows the addTransplantings.py script to be run again.
# However, plantings created for directly transplanted crops that arrived in trays
# will be deleted by default, because they are recreated by the addTransplantings.py script.

# Addng the command line argument "all" will cause this script to also 
# delete the preexisting Planting assets from the traySeedings.

from utils import *
from csv import reader

def main():

    print("Deleting Transplantings...")

    delAllPlantings = False
    if (len(sys.argv) == 2 and sys.argv[1] == 'all'):
        print("  Deleting all Plantings")
        delAllPlantings = True

    with open('sampleData/transplantings.csv', 'r') as tFile:
        t_reader = reader(decomment(tFile))
        line=1
        for row in t_reader:
            # Delete any transplantings that exist.
            # deleteAllLogs('http://localhost/log.json?type=farm_transplanting')

     
            deleteAllAssets('http://localhost/farm_asset.json?type=planting&name[sw]=0000-00-00')

    print("Transplantings deleted.")

if __name__ == "__main__":
    main()