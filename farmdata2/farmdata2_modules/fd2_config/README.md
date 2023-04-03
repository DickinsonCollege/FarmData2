# FarmData2 Configuration Module

The FarmData2 Configuration Module provides a centralized place to set configuration options that are specific to the FarmData2 features. Underlying farmOS features are still configured through the standard farmOS configuration mechanisms (See: [farmOS User Guide](https://v1.farmos.org/guide/)).

## Current Configuration Options

The current FarmData2 configuration options are as shown in the following JSON object.  The meaning and options for each field are defined below.

```json
{
  "id": 1,
  "labor": "Required",
}
```
### `id`

There is only ever one configuration record.  The `id` will always be 1.

### `labor`

The `labor` setting controls the collection and display of labor data in the input forms and reports within FarmData2.  The options for the `labor` setting are:
* `Required`: All log entries will require the input of labor data. All reports will display available labor data.
* `Optional`: All log entries will provide the option to input labor data, but it will not be required for form submission.  All reports will display available labor data.
* `Hidden`: Input forms will not display fields for the input of labor data.  Reports will omit columns that display labor data.

## Using the Configuration

Typically each page in FarmData2 will load the configuration in its `created` lifecycle hook and use it to control the appropriate aspects of the page.  The configuration should only be modified by the `config.html` page in this module.

### Getting the configuration

To use the FarmData2 configuration in a page:
1. Get the configuration information using the `getConfiguration` function in the `FarmOSAPI.js` library.  This will typically be done in the `created` lifecycle hook in a Vue page.
```Javascript
...
created() {
  function getFD2Config() {
    getConfiguration().then((response) => {
        // response.data contains the configuration object.
    })
  }
  ...  
}
```

### Changing the configuration

The configuration should only be changed from within the `config.html` file in the `fd2_config` module.  It can be changed by passing a JSON object with the fields to be updated.

```Javascript
methods: {
  function updateConfig() {

    let config={
      "labor": "Optional",  // Change the labor setting.
    }

    // Assumes the session token has been retrieved.
    setConfiguration(config, sessionToken).then(() => {
      // display a confirmation that the confg has been saved.
    }).catch((error) => {
      // display error message.
    })

  })
}
```

## Adding New Configuration Options

The `fd2_config` module can be updated and extended to add additional configuration information.  To do so requires the following steps:

* `fd2_config.install`: Add the new field to the `fd2_config_schema()` function so that it appears in the database table.  Add a default initial value for the field to the `fd2_config_install()` function, which provides the initial record in the database.
* `fd2_config.module`: Update the `fd2_config_entity_property_info()` function to include the new field in the JSON response from the API call.
* `config/config.html`: Modify the code on this page to display a UI element for displaying and modifying the new configuration element.
* Rebuild the sample database so that it includes the new options.  See the documentation in  [`/docker/sampleDB/README.md`](https://github.com/DickinsonCollege/FarmData2/tree/main/docker/sampleDB).

NOTE: This works for the development version of FarmData2.  There will need to be additional work to develop a migration plan that adds new options to deployed versions of FarmData2.  The Drupal `.install` file in the module seems to have some support for this.
