'''
area = {
    "name": "C",
    "vocabulary": areasVocabID,
    "description": "This is a bed",
    "area_type": "field",
}
response = requests.post('http://localhost/taxonomy_term', json=area, auth=HTTPBasicAuth(user, passwd))
areaID = response.json()['id']
print(areaID)

area = {
    "name": "C-1",
    "vocabulary": areasVocabID,
    "description": "This is a bed",
    "area_type": "bed",
    "parent": [{
        "id": areaID,
        "resource": "taxonomy_term"
    }],
}

response = requests.post('http://localhost/taxonomy_term', json=area, auth=HTTPBasicAuth(user, passwd))
print(response.json())
areaID = response.json()['id']
print(areaID)
'''

'''
response = requests.delete("http://localhost/log/8", auth=HTTPBasicAuth(user, passwd))
print(response)

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