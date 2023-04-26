# The FarmData2 Data Model #

This document describes the details of the FarmData2 data model.  Note that FarmData2 is built on top of farmOS and largely makes use of the standard farmOS data model.

The sections below describe each part of the sample database provided with FarmData2 for development and testing. Several pieces of information are provided for each part of the sample database:
- The scripts that create each part of the sample data are indicated and provide a good reference for how to create new records in the database.
- An API request is given for each type of data as well. Accessing these APIs using a tool like Hoppscotch or Postman is a good way to understand the structure of the data returned by API calls in FarmData2.

## The Sample Database ##

A sample database is provided with FarmData2 for development and testing purposes.

Some useful properties of the sample data:
- It is real data from the Dickinson College farm.
- The data runs from Jan 1, 2019 - July 15, 2020. So it includes:
  - One completed growing season (Jan 1 - Dec 31, 2019).
  - One in-progress growing season (Jan 1 - July 15, 2020).

More details are included in the table below:

Asset/Log Type | 2017 | 2019 | 2020 | Total | Notes
---------------|------|------|------|-------|-------|
Direct Seeding  |    3 |  182 |  101 |  286  | 2017 seedings were harvested in 2019.
Tray Seeding   |    - |  378 |  313 |  691  |
Total Seedings |    3 |  560 |  414 |  977  |
Planting       |    3 |  347 |  248 |  595  | A planting may have multiple seedings. A few plantings have no seedings.
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

A vocabulary consists of a list of terms and the relationships between them. There are a number of vocabularies that play important roles in FarmData2.

### Farm Areas ###

The Farm Areas vocabulary defines each of the areas (fields, greenhouses, beds) on the farm. This vocabulary allows areas to have sub-areas. For example, an area that is a greenhouse can have beds that are sub-types.

The terms for the Farm Areas vocabulary can be accessed using the API request:
```
GET http://localhost/taxonomy_term.json?bundle=farm_areas
```

The areas in the FarmData2 sample database are created by the `addAreas.py` script using the data in the `sampleData/areas.csv` file.

### Farm Crop Families and Farm Crops/Varieties ###

The Farm Crop Families vocabulary defines the _crop category_ names from the [USDA Organic INTEGRITY Database](https://organic.ams.usda.gov/integrity/About.aspx).  

The terms for the Farm Crop Families vocabulary can be accessed with the request:
```
GET http://localhost/taxonomy_term.json?bundle=farm_crop_families
```

The Farm Crops/Varieties Vocabulary defines all of the crops that appear in the FarmData2 database.  Each crop is assigned to one of the crop categories defined in the Farm Crop Families vocabulary.  Crops can also be parent or child-crops. For example LETTUCE is a parent crop to LETTUCE-ROMAINE and LETTUCE-GREEN, and conversely they are child crops to LETTUCE.  In addition, each crop has a default unit from the Farm Quantity Units vocabulary (see below) and also a list of conversion factors for converting from the default units to any other unit that may be used for the crop.

The terms for the Farm Crops vocabulary can be accessed with the request:
```
GET http://localhost/taxonomy_term.json?bundle=farm_crops
```

The crop families and varieties in the FarmData2 sample database are created by the `addCrops.py` script using the data in the `sampleData/crops.csv` file.

### Farm Log Categories ###

The Farm Log Categories vocabulary is used to categorize the log entries by what they pertain to (e.g. Equipment, Animals, Plantings, etc.). Of particular interest are the categories of Direct Seeding and Tray Seeding that are added to the standard farmOS vocabulary. These are sub-terms of the Planting term and are used to categorize the different types of seeding.

The terms for the Farm Log Categories vocabulary can be accessed with the request:
```
GET http://localhost/taxonomy_term.json?bundle=farm_log_categories
```

The Direct Seeding and Tray Seeding categories in the FarmData2 sample database are created by the `addSeedings.py` script.

### Farm Quantity Units ###

The Farm Quantity Units vocabulary defines the units that can be assigned to logs (e.g. Row Feet, Counts, Hours, Bunches, Pounds, etc.). The units are divided into categories (e.g. Count, Weight, Length/depth, etc).

The terms for the Farm Quantity Units vocabulary can be accessed with the request:
```
GET http://localhost/taxonomy_term.json?bundle=farm_quantity_units
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
GET http://localhost/log.json?type=farm_seeding
```

Notes:
- The `log_category` attribute can be used to distinguish between logs for Direct Seedings and logs for Tray Seedings.
- The `data` attribute will contain an object that provides the `crop_tid` of the crop that was seeded (e.g. `{ crop_tid: 115 }`).  This can be used to get the crop name without retrieving the Planting Asset.

### Planting Assets ###

All Planting Assets can be accessed with the request:
```
GET http://localhost/farm_asset.json?type=planting
```
The Planting Assets in the FarmData2 sample database are created primarily by the `addDirectSeeding.py` and `addTraySeeding.py` scripts when new seedings are created, as described above. However, a few are created by `addTransplanting.py` as well when a transplanting record was found without a matching seeding record.

Notes:
- The Planting Asset does not itself have a location. The location of a Planting Asset is assigned to the location given in the Seeding Log that references it. Similarly, if the Planting Asset was created by a tray seeding, then its location can also be changed by a transplanting operation.

## Transplanting Logs ##

Each _Transplanting Log_ corresponds to the transplanting of a _Planting Asset_ created by one or more _Tray Seedings_ from a greenhouse to a field or bed. When a Transplanting Log is created it includes a _Movement_ attribute that indicates the new location of the planting.  The farmOS system uses the Movement attribute to automatically create a _Movement Log_ indicating the new location of the Planting Asset.  Future requests for the Planting Asset will then show it in the updated location.

All Transplanting Logs can be accessed with the request:
```
GET http://localhost/log.json?type=farm_transplanting
```

The Transplanting Logs in the FarmData2 sample database are created by the `addTransplantings.py` script using the data in the `sampleData/transplantings.csv` file.

Notes:
- The `data` attribute will contain an object that provides the `crop_tid` of the crop that was transplanted (e.g. `{ crop_tid: 115 }`).  This can be used to get the crop name without retrieving the Planting Asset.

## Harvest Logs ##

Each _Harvest Log_ represents one harvesting event and is linked to the _Planting Asset_ from which the harvest occurred.

All Harvest Logs can be accessed with the request:
```
GET http://localhost/log.json?type=farm_harvest
```

The Harvest Logs in the FarmData2 sample database are created by the `addHarvests.py` script using the data in the `sampleData/harvests.csv` file.

Notes:
- The `data` attribute will contain an object that provides the `crop_tid` of the crop that was transplanted (e.g. `{ crop_tid: 115 }`).  This can be used to get the crop name without retrieving the Planting Asset.

# Building the Provided Databases #

The following sections detail how to build the empty and sample databases that are provided for development with the FarmData2 repo.

## Building the Empty Database ##

When the Drupal or farmOS images are updated, it is sometimes necessary to rebuild the empty database to allow the full sample database to be built on top of it.  The following steps outline how to build the empty database.

1. Change to the `docker` directory in `FarmData2`.
1. `rm -rf db`
1. `rm settings.php`
1. `cp settings-default.php settingsp.php`
1. `./fd2-up.bash`
1. Visit `http:\\localhost` in a browser.
1. Follow the install instructions with the following information:
   1. __Verify Requirements__
      1. _Database name_: `farm`
      1. _Database username_: `farm`
      1. _Database password_: `farm`
      1. __Advanced Options__:
         1. _Database host_: `fd2_mariadb`
   1. __Configure Site__
      1. _Site name_: `Sample Farm`
      1. _Site e-mail address_: `sample@sample.farm`
      1. _Username_: `admin`
      1. _E-mail address_: `admin@sample.farm`
      1. _Password_: `farmdata2`
      1. _Default Country_: `United States`
      1. _Default time zone_: `America\New York`
      1. _Check for updates automatically_: unchecked
      1. _Receive e-mail notifications_: unchecked
   1. __Configure farmOS__
      1. _System of measurement_: US/Imperial
   1. __Finished__
      1. Click `Visit your new site`
1. Click `Manage`
   1. Click `Modules`
      1. Turn on modules for:
         * `FarmData2 BarnKit`
         * `FarmData2 Example`
         * `FarmData2 FieldKit`
         * `FarmData2 School`
      1. Click `Save configuration`
   1. Click `Appearance`
      1. Click `Logo image settings`
         1. Uncheck `Use the default logo`
         1. _Path to custom logo_: `farmdata2logo.png`
      1. Click `Save configuration`
         1. Logo should change to FarmData2 logo.
1. Click `Log out`
1. `./fd2-down.bash`
1. `rm db.empty.tar.bz2`
1. `sudo tar cjvf db.empty.tar.bz2 db`

## Building the Sample Database ##

The sample database is built on top of the empty database.  The csv files in the `docker/sampleData` directory provide the data for the sample database. Each file contains a detailed description of its purpose, contents, and format in the comments at the top of the file. The `buildSampleDB.bash` script and its sub-scripts use the contents of the csv files in the `sampleData` directory to create the sample database on top of the provided empty database. The following steps will rebuild the sample database.  Note: Building the sample database typically takes 10-20 minutes.

1. Ensure that `python3` is installed in `/usr/bin`
1. `python3 -m pip install requests`
1. Change to the `docker` directory in `FarmData2`.
1. `rm db.sample.tar.bz2`
1. Change to the `sampleDB` directory in `FarmData2/docker`.
1. `./buildSampleDB.bash`
