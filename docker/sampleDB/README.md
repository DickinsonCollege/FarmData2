# The FarmData2 Data Model #

This document describes the details of the FarmDat2 data model.  Note that FarmData2 is built on top of farmOS and largely makes use of the standard farmOS data model.

## The Sample Database ##

A sample database is provided with FarmData2 for development and testing purposes.  That database is created by running the `buildSampleDB.bash` script.  That script, and its sub-scripts, use the contents of the csv files in the `sampleData` directory to create the sample database.  Each of csv files in the `sampleData` directory gives a description of its purpose, contents and format in the comments at the top of the file.

## Vocabularies ##

A vocabulary consists of a list of term and the relationships between them. There are a number of vocabularies that play important roles in FarmData2.

### Farm Areas ###

The Farm Areas vocabulary defines each of the areas (fields, greenhouses, beds) on the farm. The areas in the sample database are created from the data in `sampleData/areas.csv`  This vocabulary allows areas to have sub-areas. For example a bed in a field or in a greenhouse.

### Farm Crop Families and Farm Crops/Varieties ###

The Farm Crop Families vocabulary defines the _crop category_ names from the USDA Organic INTEGRITY Database (https://organic.ams.usda.gov/integrity/About.aspx).  The Farm Crops/Varities Vocabulary define all of the crops that appear in the FarmData2 database.  Each crop is assigned to one of the crop categories defined in the Farm Crop Families vocabulay.  Crops can also be parent or child-crops. For example LETTUCE is a parent crop to ROMAINE and GREEN, and conversely they are child crops to LETTUCE.

