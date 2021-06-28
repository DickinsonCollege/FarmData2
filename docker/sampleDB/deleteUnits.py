#!/usr/bin/python3

# Deletes all of the terms in the Farm Quantity Units vocabulary.

from utils import *

print("Deleting Units...")
deleteAllVocabTerms("http://localhost/taxonomy_term.json?bundle=farm_quantity_units")
print("Units deleted.")