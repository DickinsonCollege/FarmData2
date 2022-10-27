#!/usr/bin/python3

# Deletes all of the harvest logs.

from utils import *
import os

# Get the hostname of the farmOS server.
host = os.getenv('FD2_HOST')

def main():

    print("Deleting Harvests...")

    # Delete any harvests that exist.
    deleteAllLogs("http://" + host + "/log.json?type=farm_harvest")

    print("Harvests deleted.")

if __name__ == "__main__":
    main()
