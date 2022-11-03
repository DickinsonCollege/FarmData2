#!/usr/bin/python3

# Deletes all of the terms in the Farm Quantity Units vocabulary.

from utils import *
import os

# Get the hostname of the farmOS server.
host = os.getenv('FD2_HOST')

print("Deleting Units...")
deleteAllVocabTerms("http://" + host + "/taxonomy_term.json?bundle=farm_quantity_units")
print("Units deleted.")
