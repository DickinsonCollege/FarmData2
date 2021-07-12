# The FarmData2 Data Model #

This document describes the details of the FarmDat2 data model.  Note that FarmData2 is built on top of farmOS and largely makes use of the standard farmOS data model.

The sections below describe each part of the sample database provided with FarmData2 for development and testing. Several pieces of information are provide for each part of the sample database:
- The scripts that create each part of the sample data are indicated and provide a good reference for how to create new records in the database.
- An API request is given for each type of data as well. Accessing these APIs using a tool like Hoppscotch or Postman is a good way to understand the structure of the data returned by API calls in FarmData2. 

## The Sample Database ##

A sample database is provided with FarmData2 for development and testing purposes.  That database is created by running the `buildSampleDB.bash` script.  That script, and its sub-scripts, use the contents of the csv files in the `sampleData` directory to create the sample database.  Each of csv files in the `sampleData` directory gives a description of its purpose, contents and format in the comments at the top of the file.

Some useful properties of the sample data:
- It is real data from the Dickinson College farm.
- The data runs from Jan 1, 2019 - July 15, 2020. So it includes:
  - One completed growing season (Jan 1 - Dec 31, 2019). 
  - One in progress growing season (Jan 1 - July 15, 2020).

More details are included in the table below:

Asset/Log Type | 2017 | 2019 | 2020 | Total | Notes
---------------|------|------|------|-------|-------|
Direct Seeing  |    3 |  182 |  101 |  286  | 2017 seedings were harvested in 2019.
Tray Seeding   |    - |  378 |  313 |  691  |
Total Seedings |    3 |  560 |  414 |  977  |
Planting       |    3 |  347 |  248 |  595  | A planting may have multiple sedings. A few plantings have no seedings.
Transplanting  |    - |  171 |  117 |  288  | Plantings are transplanted and thus may include multiple tray seedings. A few transplantings do not have a tray seeding.
Harvest        |    - | 1592 |  487 | 2079  |

The sub-sections below give more complete details of each part of the sample database.

## People ##

The FarmData2 sample database contains the following _People_ (i.e. users):

User Name | Password  | Notes |
----------|-----------|--------
manager1  | farmdata2 | Full edit permissions
manager2  | farmdata2 |
worker1   | farmdata2 | Limited edit permissions
worker2   | farmdata2 |
worker3   | farmdata2 |
worker4   | farmdata2 |
worker5   | farmdata2 |
guest     | farmdata2 | No edit permissions
restws1   | farmdata2 | For REST API access only.

The users in the FarmData2 sample database are created by the `addPeople.bash` script.

## Vocabularies ##

A vocabulary consists of a list of term and the relationships between them. There are a number of vocabularies that play important roles in FarmData2.

### Farm Areas ###

The Farm Areas vocabulary defines each of the areas (fields, greenhouses, beds) on the farm. This vocabulary allows areas to have sub-areas. For example, an area that is a greenhouse can have beds that aree sub-types.

The terms for the Farm Areas vocabulary can be accessed using the API request:
```
GET http://localhost/taxonomy_term.json?bundle=farm_areas
```

The areas in the FarmData2 sample database are created by the `addAreas.py` script using the data in the `sampleData/areas.csv` file.

### Farm Crop Families and Farm Crops/Varieties ###

The Farm Crop Families vocabulary defines the _crop category_ names from the [USDA Organic INTEGRITY Database](https://organic.ams.usda.gov/integrity/About.aspx).  

The terms for the Farm Crop Families vocabulary can be accessed with the request:
```
GET http://localhost/taxonomy_term.json?bundle=farm_crop_families"
```

The Farm Crops/Varities Vocabulary define all of the crops that appear in the FarmData2 database.  Each crop is assigned to one of the crop categories defined in the Farm Crop Families vocabulay.  Crops can also be parent or child-crops. For example LETTUCE is a parent crop to LETTUCE-ROMAINE and LETTUCE-GREEN, and conversely they are child crops to LETTUCE.  In addition, each crop has a default unit from the Farm Quantity Units vocabulary (see below) and also a list of conversion factors for converting from the default units to any other unit that may be used for the crop.

The terms for the Farm Crops vocabulary can be accessed with the request:
```
GET http://localhost/taxonomy_term.json?bundle=farm_crops"
```

The crop families and varieties in the FarmData2 sample database are created by the `addCrops.py` script using the data in the `sampleData/crops.csv` file.

### Farm Log Categories ###

The Farm Log Categories vocabulary is used to categorize the log entries by what they pertain to (e.g. Equipment, Animals, Plantings, etc.). Of particular interest are the categories of Direct Seeding and Tray Seeding that are added to the standard farmOS vocabulary. These are sub-terms of the Planting term and are used to categorize the differnt types of seeding.

The terms for the Farm Log Categories vocabulary can be accessed with the request: 
```
GET http://localhost/taxonomy_term.json?bundle=farm_log_categories"
```

The Direct Seeding and Tray Seeding categories in the FarmData2 sample database are created by the `addSeedings.py` script.

### Farm Quantity Units ###

The Farm Quantity Units vocabulary defines the units that can be assigned to logs (e.g. Row Feet, Counts, Hours, Bunches, Pounds, etc.). The units are divided into categories (e.g. Count, Weight, Length/depth, etc).

The terms for the Farm Quantity Units vocabulary can be accessed with the request:
```
GET http://localhost/taxonomy_term.json?bundle=farm_quantity_units"
```

The quantity units in the FarmData2 sample database are created by the `addUnits.py` script using the data in the `sampleData/units.csv` file.

## Seeding Logs and Planting Assets ##

A _seeding_ is a crop that has been planted from seed either directly in the ground (a _Direct Seeding_) or in a seeding tray (a _Tray Seeding_).  There is one _Seeding Log_ for every seeding and each is categorized as either a Direct Seeding or a Tray Seeding. 

Every Seeding Log is associated with a _Planting Asset_, which represents the crop that resulted from the planting.  Planting Assets indicate the crops that are available for future operations (e.g. observation, transplanting, harvesting, etc.).

The Planting Asset must be created before the Seeding Log because the Seeding Log must reference the Planting Asset that it creates. 

The Seeding Logs and associated Planting Assets in the FarmData2 sample database are created by the `addDirectSeedings.py` and `addTraySeedings.py` scripts using the data in the `sampleData/directSeedings.csv` and `sampleData/traySeedings.csv` files.

### Seeding Logs ###

All Seeding Logs can be accessed with the request:
```
GET http://localhost/log.json?type=farm_seeding"
```

Notes:
- The `log_category` attribute can be used to distinguish between logs for Direct Seedings and logs for Tray Seedings.
- The `data` attribute will contain an object that provides the `crop_tid` of the crop that was seeded (e.g. `{ crop_tid: 115 }`).  This can be used to get the crop name wihtout retrieving the Planting Asset.

### Planting Assets ###

All Planting Assets can be accessed with the request:
```
GET http://localhost/farm_asset.json?type=planting"
```

Notes:
- The Planting Asset does not itself have a location. The location of a Planting Asset is assigned to location given in the Seeding Log that references it. Similarly, if the Planting Asset was created by a tray seeding, then its location can also be changed by a transplanting operation.

## Transplanting Logs ##

Each _Transplanting Log_ corresponsds to the transplanting of a _Planting Asset_ created by one or more _Tray Seedings_ from a greenhouse to a field or bed. When a Transplanting Log is created it includes a _Movement_ attribute that indicates the new location of the planting.  The farmOS system uses the Movement Attribute to automatically creates a _Movement Log_ indicating the new location of the Planting Asset.  Future requests for the Planting Asset will then show it in the updated location.

All Transplanting Logs can be accessed with the request:
```
GET http://localhost/log.json?type=farm_transplanting"
```

The Transplanting Logs in the FarmData2 sample database are created by the `addTransplantings.py` script using the data in the `sampleData/transplantings.csv` file.

## Harvest Logs ##

Each _Harvest Log_ represents one harvesting event and is linked to the _Planting Asset_ from which the harvest occurred.

All Harvest Logs can be accessed with the request:
```
GET http://localhost/log.json?type=farm_harvest"
```

The Harvest Logs in the FarmData2 sample database are created by the `addHarvests.py` script using the data in the `sampleData/harvests.csv` file.