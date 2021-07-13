import requests
from requests.auth import HTTPBasicAuth
import sys
from datetime import datetime

# The username and password for the authorized basic authentication user
# See addPeople.bash.
user='restws1'
passwd='farmdata2'

# Skip blank lines and drop all comments.
# Comment must have # in first column.
def decomment(csvfile):
    for row in csvfile:
        if row.strip() != "" and not row.startswith('#'):
            yield row

# Print the line to standard error.
def errPrint(line):
    print(line, file=sys.stderr)

# Convert a YYYY-MM-DD time string into a unix time stamp.
def YYYYMMDDtoTimestamp(dateStr):
    theTime = datetime.strptime(dateStr,'%Y-%m-%d')
    return int(theTime.timestamp())

def getAllPages(url, theList=[], page=0):
    # Note: Using page argument here because the next URL in the
    # response sometimes does not work (e.g. drops the .json from the
    # url for some reason.
    response = requests.get(url, auth=HTTPBasicAuth(user, passwd))
    respJson = response.json()
    theList = respJson['list']

    if ("next" not in respJson):
        return theList
    else:
        nextURL = url + '&page=' + str(page+1)
        theList.extend(getAllPages(nextURL, theList, page+1))
        return theList
 
# Get the ID of a specific vocabulary in the taxonomy.
def getVocabularyID(vocab):
    response = requests.get("http://localhost/taxonomy_vocabulary.json?machine_name=" + vocab, 
        auth=HTTPBasicAuth(user, passwd))
    return response.json()['list'][0]['vid']

# Get the ID of a specific vocabulary term.
def getTermID(term):
    response = requests.get("http://localhost/taxonomy_term.json?name=" + term, 
        auth=HTTPBasicAuth(user, passwd))
    return response.json()['list'][0]['tid']

# Get a vocbulary term with the specified tid.
def getTerm(tid):
    response = requests.get("http://localhost/taxonomy_term.json?tid=" + tid, 
        auth=HTTPBasicAuth(user, passwd))
    return response.json()['list'][0]

def addSeedingCategory(category):
    # Get the id of the Farm Log Categories Vocabulary so we can add Direct and Tray seedings.
    logCatsVocabID = getVocabularyID('farm_log_categories')

    # Get the id of the Planting Farm Log Category so that we can use it
    # as a parent for the Direct and Tray seedings.
    plantingsID = getTermID('Plantings')

    cat = {
        "name": category,
        "vocabulary": logCatsVocabID,
        "parent": [{
            "id": plantingsID,
            "resource": "taxonomy_term"
        }],
    }
    return addVocabTerm(cat)
    
def deleteSeedingCategory(category): 
    response = requests.get("http://localhost/taxonomy_term.json?&name=" + category
    , auth=HTTPBasicAuth(user, passwd))
    catJson = response.json()['list']
    if (len(catJson) > 0):
        catID = catJson[0]['tid']
        catName = catJson[0]['name']
        deleteVocabTerm(catID, catName)

# Delete all of the assets returned by the url.
def deleteAllAssets(url):
    moreExist = True

    while moreExist:
        assets = getAllPages(url)
        moreExist = (len(assets) > 0)
        
        for asset in assets:
            assetID = asset['id']
            response = requests.delete("http://localhost/farm_asset/" + assetID, 
                auth=HTTPBasicAuth(user, passwd))

            if(response.status_code == 200):
                print("Deleted Asset: " + asset['name'] + " with id " + assetID)

# Adds the asset indicated by the data object.
def addAsset(data):
    response = requests.post('http://localhost/farm_asset', 
        json=data, auth=HTTPBasicAuth(user, passwd))

    if(response.status_code == 201):
        assetID = response.json()['id']
        print("Created Asset: " + data['name'] + " with id " + assetID)
        return assetID
    else:
        print("Error Creating Asset: " + data['name'])
        sys.exit(-1)

# Delete all of the logs returend by a request to the url
def deleteAllLogs(url):
    moreExist = True

    while moreExist:
        logs = getAllPages(url)
        moreExist = (len(logs) > 0)
        
        for log in logs:
            logID = log['id']
            response = requests.delete("http://localhost/log/" + logID, 
                auth=HTTPBasicAuth(user, passwd))

            if(response.status_code == 200):
                print("Deleted Log: " + log['name'] + " with id " + logID)
    

# Add the log indicated by the data object.
def addLog(data):
    response = requests.post('http://localhost/log', 
        json=data, auth=HTTPBasicAuth(user, passwd))

    if(response.status_code == 201):
        logID = response.json()['id']
        print("Created Log: " + data['name'] + " with id " + logID)
        return logID
    else:
        print(response)
        print("Error Creating Log: " + data['name'])
        sys.exit(-1)

# Delete all of the terms in the vocabulary given by the url.
def deleteAllVocabTerms(url):
    termsExist = True

    while termsExist:
        terms = getAllPages(url)
        termsExist = (len(terms) > 0)

        for term in terms:
            termID = term['tid']
            response = requests.delete("http://localhost/taxonomy_term/" + termID, 
                auth=HTTPBasicAuth(user, passwd))

            if(response.status_code == 200):
                print("Deleted Term: " + term['name'] + " with id " + termID)

# Delete a single vocabulary term by its id/
def deleteVocabTerm(termID, term):
    response = requests.delete("http://localhost/taxonomy_term/" + termID, 
            auth=HTTPBasicAuth(user, passwd))

    if(response.status_code == 200):
            print("Deleted Term: " + term + " with id " + termID)

# Add a new vocabulary term to the vocabulary indicated in the data object.
def addVocabTerm(data):
    response = requests.post('http://localhost/taxonomy_term', 
        json=data, auth=HTTPBasicAuth(user, passwd))

    if(response.status_code == 201):
        termID = response.json()['id']
        print("Created Term: " + data['name'] + " with id " + termID)
        return termID
    else:
        print("Error Creating Term: " + data['name'])
        sys.exit(-1)

# Perform translations on crop names to clean up data so that
# all crop names in the database are in the Farm Crops/Varieties vocabulary.
def translateCrop(line, crop):
    translations = {
        #"Name in DB": "Correct Name"
        "CHINESE CABBAGE": "CABBAGE-CHINESE",
        "CORN, DRY": "CORN-DRY",
        "CORN, SWEET": "CORN-SWEET",
        "FENNEL": "HERB-FENNEL",
        "GARLIC, GREEN": "GARLIC-GREEN",
        "GREENS, MES MIX": "GREENS-MES MIX",
        "HERB - BASIL": "HERB-BASIL",
        "HERB - CHIVES": "HERB-CHIVES",
        "HERB - CILANTRO": "HERB-CILANTRO",
        "HERB - DILL": "HERB-DILL",
        "HERB - MARJORAM": "HERB-MARJORAM",
        "HERB - MINT": "HERB-MINT",
        "HERB - OREGANO": "HERB-OREGANO",
        "HERB - PARSLEY": "HERB-PARSLEY",
        "HERB - SAGE": "HERB-SAGE",
        "HERB - THYME": "HERB-THYME",
        "LETTUCE, MES MIX": "LETTUCE-MES MIX",
        "LETTUCE, GREEN": "LETTUCE-GREEN",
        "LETTUCE, RED": "LETTUCE-RED",
        "LETTUCE, ROMAINE": "LETTUCE-ROMAINE",
        "MELON: CANTELOPE": "CANTELOPE",
        "MELON - WATERMELON": "WATERMELON",
        "ONION SPRING": "ONION-SPRING",
        "ONION, FRESH": "ONION-FRESH",
        "ONION STORAGE": "ONION-STORAGE",
        "PEA, SNAP": "PEA-SNAP",
        "PEPPERS, BELL": "PEPPERS-BELL",
        "PEPPERS, HOT": "PEPPERS-HOT",
        "RADISH DAIKON": "RADISH-DAIKON",
        "SQUASH - BUTTERNUT": "SQUASH-BUTTERNUT",
        "SQUASH, WINTER": "SQUASH-WINTER",
        "SUMMER SQUASH": "SQUASH-SUMMER",
        "SWEET POTATO": "POTATO-SWEET",
        "TOMATO, CHERRY": "TOMATO-CHERRY",
        "TOMATO, HEIRLOOM": "TOMATO-HEIRLOOM",
        "TOMATO, PASTE": "TOMATO-PASTE",
        "TOMATO, SLICING": "TOMATO-SLICING",
    }

    if crop in translations:
        return translations[crop]
    else:
        errPrint("Line " + str(line) + ": Error - crop " + crop + " is not in Farm Crops/Varities vocab")
        errPrint("Line " + str(line) + ": Error - crop " + crop + " is not in Farm Crops/Varities/vocabulary.")
        errPrint("  Add a translation for " + crop + " in translateCrop in utils.py")
        sys.exit(-1)

# Validate and possibly remap the crops 
def validateCrop(line, crop, cropMap):
    if crop in cropMap:
        return crop
    else:
        return translateCrop(line, crop)

# Get a map from crop name to id. Create compund names for the ones with 
# parents (e.g. LETTUCE-RED)
def getCropMap():
    cropVocabID = getVocabularyID('farm_crops')
    allCrops = getAllPages("http://localhost/taxonomy_term.json?vocabulary=" + cropVocabID)
    cropMap = {}

    for crop in allCrops:
        name = crop['name']
        cropMap[name] = crop['tid']

    return cropMap

# Perform translations on area names to clean up data so that
# all area names in the database are in the Farm Areas vocabulary.
def translateArea(line, area):
    translations = {
        #"Name in DB": "Correct Name"
        "ALF 1": "ALF-1",
        "ALF 2": "ALF-2",
        "ALF 3": "ALF-3",
        "ALF 4": "ALF-4",
        "ASPARAGUS": "M",   # other asparagus harvests happen here.
        "1-PASTURE": "PASTURE"
    }

    if area in translations:
        return translations[area]
    else:
        errPrint("Line " + str(line) + ": Error - area " + area + " is not in Farm Areas vocabulary.")
        errPrint("  Add a translation for " + area + " in translateArea in utils.py")
        sys.exit(-1)

# Validate and possibly remap the area 
def validateArea(line, area, areaMap):
    if area in areaMap:
        return area
    else:
        return translateArea(line, area)

# Get a map of the Areas that maps from name to id.
def getAreaMap():
    areasVocabID = getVocabularyID('farm_areas')
    allAreas = getAllPages("http://localhost/taxonomy_term.json?vocabulary=" + areasVocabID)
    areaMap = {}

    for area in allAreas:
        name = area['name']
        areaMap[name] = area['tid']

    return areaMap

# Perform translations on user names so that the users in the 
# data match users in the sample data base.
def translateUser(line, user):
    translations = {
        #"Name in DB": "Correct Name"
        "halpinj": "manager1",
        "steimanm": "manager2",
        "wolfje": "worker1",
        "horowitk": "worker2",
        "hutchinl": "worker3",
        "nelsonw": "worker4",
        "ryanv": "worker5",
        "wolfje": "worker1",
        "binhammm": "worker2",
        "baislepa": "worker3",
        "tongt": "worker4",
        "nusekabc": "worker5",
        "yaojo": "worker1",
        "baurc": "worker2",
    }

    if user in translations:
        return translations[user]
    else:
        errPrint("Line " + str(line) + ": Error - user " + user + " is not a known user.")
        errPrint("  Add a translation for " + user + " in translateUser in utils.py")
        sys.exit(-1)

# Validate and possibly remap a user 
def validateUser(line, user, userMap):
    if user in userMap:
        return user
    else:
        return translateUser(line, user)

# Get a map of users from name to id.
def getUserMap():
    allUsers = getAllPages("http://localhost/user.json?")
    userMap = {}

    for user in allUsers:
        name = user['name']
        userMap[name] = user['uid']

    return userMap

# Perform translations on unit names so that the units in the 
# data match units in the sample data base.
def translateUnit(line, unit):
    translations = {
        #"Name in DB": "Correct Name"
    }

    if unit in translations:
        return translations[unit]
    else:
        errPrint("Line " + str(line) + ": Error - unit " + unit + " is not a known unit.")
        errPrint("  Add a translation for " + unit + " in translateUnits in utils.py")
        sys.exit(-1)

# Validate and possibly remap a unit
def validateUnit(line, unit, unitMap):
    if (unit in unitMap):
        return unit
    else:
        return translateUnit(line, unit)

# Get a map of the units from name to id.
def getUnitsMap():
    unitsVocabID = getVocabularyID('farm_quantity_units')
    allUnits = getAllPages("http://localhost/taxonomy_term.json?vocabulary=" + unitsVocabID)
    unitsMap = {}

    for unit in allUnits:
        name = unit['name']
        unitsMap[name] = unit['tid']

    return unitsMap

# Get a map of the units from name to measure
# The measure is the parent in the unit and needs to be made lowercase.
def getMeasuresMap():
    unitsVocabID = getVocabularyID('farm_quantity_units')
    allUnits = getAllPages("http://localhost/taxonomy_term.json?vocabulary=" + unitsVocabID)
    measuresMap = {}

    for unit in allUnits:
        if len(unit['parent']) > 0:
            name = unit['name']
            measuresMap[name] = unit['parent'][0]['name'].lower()

    return measuresMap