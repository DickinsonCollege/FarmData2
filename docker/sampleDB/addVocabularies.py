#!/usr/bin/python3

# Creates the vocabularies used by FarmData2 based on the 
# contents of the files in teh sampleData directory

import requests
from requests.auth import HTTPBasicAuth
from time import time
import json

# The username and password for the authorized basic authentication user
# See addPeople.bash.
user='restws1'
passwd='farmdata2'


response = requests.delete("http://localhost/log/8", auth=HTTPBasicAuth(user, passwd))
print(response)

'''
response = requests.get("http://localhost/farm.json", auth=HTTPBasicAuth(user, passwd))
print(response.json())


timestamp=int(time())
log = {
    "name": "Test observation via REST from python", 
    "type": "farm_observation", 
    "timestamp": timestamp,
}
resp = requests.post('http://localhost/log', json=log, auth=HTTPBasicAuth(user, passwd))
respJ = resp.json()
print(respJ['id'])  # id of the created log.

#docker exec -it fd2_farmdata2 drush taxocsv-import
'''