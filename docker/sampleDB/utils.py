import requests
from requests.auth import HTTPBasicAuth
import sys

# The username and password for the authorized basic authentication user
# See addPeople.bash.
user='restws1'
passwd='farmdata2'

# Skip blank lines and drop all comments.
def decomment(csvfile):
    for row in csvfile:
        raw = row.split('#')[0].strip()
        if raw: yield raw


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
 
def getVocabularyID(vocab):
    response = requests.get("http://localhost/taxonomy_vocabulary.json?machine_name=" + vocab, 
        auth=HTTPBasicAuth(user, passwd))
    vocabID = response.json()['list'][0]['vid']

    return vocabID


# Get a list of crops. Create compund names for the ones with 
# parents (e.g. LETTUCE-RED)
def getCropList():
    cropVocabID = getVocabularyID('farm_crops')
    allCrops = getAllPages("http://localhost/taxonomy_term.json?vocabulary=" + cropVocabID)
    cropList = []

    for crop in allCrops:
        name = crop['name']

        if len(crop['parent']) != 0:
            parent = crop['parent'][0]['name']
            name = parent + "-" + name

        cropList.append(name)

    return cropList

# Print the line to standard error.
def errPrint(line):
    print(line, file=sys.stderr)

# Validate and possibly remap the field 
def validateField(line, field, fieldList):
    translations = {
        #"Name in DB": "Correct Name"
        "ALF 1": "ALF-1",
        "ALF 2": "ALF-2",
        "ALF 3": "ALF-3",
        "ALF 4": "ALF-4",
        "1-PASTURE": "PASTURE"
    }

    if field in fieldList:
        return field
    else:
        if field in translations:
            return translations[field]
        else:
            errPrint("Line " + str(line) + ": Error - field " + field + " is not in Farm Areas vocabulary.")
            errPrint("  Add a translation for " + field + " in validateField in utils.py")
            #sys.exit(-1)

# Get a list of the Areas.
def getAreaList():
    areasVocabID = getVocabularyID('farm_areas')
    allAreas = getAllPages("http://localhost/taxonomy_term.json?vocabulary=" + areasVocabID)
    areaList = []

    for area in allAreas:
        name = area['name']
        areaList.append(name)

    return areaList

# Validate and possibly remap the field 
def validateCrop(line, crop, cropList):
    translations = {
        #"Name in DB": "Correct Name"
        "CORN, DRY": "CORN-DRY",
        "CORN, SWEET": "CORN-SWEET",
        "GARLIC, GREEN": "GARLIC-GREEN",
        "GREENS, MES MIX": "LETTUCE-MES MIX",
        "HERB - CILANTRO": "HERB-CILANTRO",
        "HERB - DILL": "HERB-DILL",
        "LETTUCE, MES MIX": "LETTUCE-MES MIX",
        "ONION SPRING": "ONION-SPRING",
        "PEA, SNAP": "PEA-SNAP",
        "RADISH DAIKON": "RADISH-DAIKON",
        "SWEET POTATO": "POTATO-SWEET",
    }

    if crop in cropList:
        return crop
    else:
        if crop in translations:
            return translations[crop]
        else:
            errPrint("Line " + str(line) + ": Error - crop " + crop + " is not in Farm Crops/Varities vocabulary.")
            errPrint("  Add a translation for " + crop + " in validateCrop in utils.py")
            #sys.exit(-1)