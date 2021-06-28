#!/usr/bin/python3

# Deletes all terms in the Farm Area vocabulary used by the FarmData2 sample database.

from utils import *

print("Deleting Areas...")
deleteAllVocabTerms("http://localhost/taxonomy_term.json?bundle=farm_areas")
print("Areas Deleted.")