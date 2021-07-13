#!/usr/bin/python3

# Deletes all of the harvest logs.

from utils import *

def main():

    print("Deleting Harvests...")

    # Delete any harvests that exist.
    deleteAllLogs('http://localhost/log.json?type=farm_harvest')

    print("Harvests deleted.")

if __name__ == "__main__":
    main()