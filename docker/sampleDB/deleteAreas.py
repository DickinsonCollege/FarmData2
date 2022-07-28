#!/usr/bin/python3

# Deletes all terms in the Farm Area vocabulary used by the FarmData2 sample database.

from utils import *
import os

# Get the hostname of the farmOS server.
host = os.getenv('FD2_HOST')

print("Deleting Areas...")
deleteAllVocabTerms("http://" + host + "/taxonomy_term.json?bundle=farm_areas")
print("Areas Deleted.")
