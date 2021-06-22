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

# Print the line to standard error.
def errPrint(line):
    print(line, file=sys.stderr)

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
    vocabID = response.json()['list'][0]['vid']

    return vocabID

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

# Perform translations on crop names to clean up data so that
# all crop names in the database are in the Farm Crops/Varieties vocabulary.
def translateCrop(line, crop):
    translations = {
        #"Name in DB": "Correct Name"
        "CORN, DRY": "CORN-DRY",
        "CORN, SWEET": "CORN-SWEET",
        "GARLIC, GREEN": "GARLIC-GREEN",
        "GREENS, MES MIX": "LETTUCE-MES MIX",
        "HERB - CILANTRO": "CILANTRO",
        "HERB - DILL": "DILL",
        "LETTUCE, MES MIX": "LETTUCE-MES MIX",
        "ONION SPRING": "ONION-SPRING",
        "PEA, SNAP": "PEA-SNAP",
        "RADISH DAIKON": "RADISH-DAIKON",
        "SWEET POTATO": "POTATO-SWEET",
    }

    if crop in translations:
        return translations[crop]
    else:
        errPrint("Line " + str(line) + ": Error - crop " + crop + " is not in Farm Crops/Varities vocabulary.")
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

        if len(crop['parent']) != 0:
            parent = crop['parent'][0]['name']
            name = parent + "-" + name

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

# Get a list of the Areas.
def getAreaMap():
    areasVocabID = getVocabularyID('farm_areas')
    allAreas = getAllPages("http://localhost/taxonomy_term.json?vocabulary=" + areasVocabID)
    areaMap = {}

    for area in allAreas:
        name = area['name']
        areaMap[name] = area['tid']

    return areaMap

