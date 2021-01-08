## FarmData2 Field Kit Module ##

The FarmData2 Field Kit module provides the _FD2 FieldKit tab_.  The FieldKit tab contains sub-tabs for forms that are useful for fast and accurate data entry in the field.

### Enabling the FarmData2 Field Kit Module ###

The FieldKit tab should be enabled and visible by default when logged in as a _Farm Worker_ or a _Farm Manager_.

If the FieldKit tab is not visible, it can be enabled by the `admin` user as follows:
1. Log into FarmData2 as `admin`
1. Click `Manage`
1. CLick `Modules`
1. Click `FarmData2` in the left column.
1. Click to turn the `FarmData2 Field Kit` on.
1. Click `Save configuration`

When returning to the home screen the FieldKit tab should now appear.

### Module Structure ###

The essential elements of the FarmData2 Field Kit module include:

- `fd2_field_kit.info`: Defines the module so that it is recognizable by Drupal.
- `fd2_field_kit.module`: Contains the PHP implementation of the module. This code determines when the FieldKit tab is visible based on the user's role and defines the sub-tabs for each of the forms.
- `*.html`: The form on each sub-tab is defined by the contents of an html file (e.g. `info.html`, `example.html`).
- `cypress`: End-to-end tests built using the [Cypress testing framework](https://www.cypress.io/) are required for each form.
  - `cypress.json`: A configuration file for Cypress.
  - `cypress\integration\*.spec.js`: The test code. There will typically be one `spec` file for each form (e.g. `info.spec.js`, `example.spec.js`) that fully tests its functionality.

### Adding a New Form ###

To add a new form to the FieldKit tab:
1. Ensure that a development instance of FarmData2 is up and running. See [INSTALL.md](https://github.com/DickinsonCollege/FarmData2/blob/main/INSTALL.md) for full instructions.
1. Edit the `fd2-field-kit.module` file to add a new `array` to the `$items` array for the new sub-tab.  The `array` for the _Example_ tabs (shown below) is a good example to work:
   ```php
   <?php
   //...
   function fd2_field_kit_menu() {
       $items['farm/fd2-field-kit/examples'] = array(
         'title' => 'Example',
         'type' => MENU_LOCAL_TASK,
         'page callback' => 'fd2_field_kit_view',
         'page arguments' => array('example.html'),
         'access arguments' => array('View FD2 Field Kit'),
         'weight' => 100,
       );
   };
   ```
   - Three elements of the `array` must be customized for your form:
     - `farm/fd2-field-kit/example`: This is the URL of the example sub-form. Replace `example` with the end of the URL you want for your form.
     - `title`: This is the name of the sub-tab that appears in the FieldKit tab.  Replace `Example` with the name of your form.
     - `example.html`: This is the html file that provides the form content. Replace this with the name of the html file for your new form.
1. Create the html file you named above. Insert some _dummy code_ for now just to get the sub-tab up and visible. For example:
   ```html
   <body>
      <p>This is my sub-tab</p>
   </body>
   ```
   - Note that it is not necessary to include all of the html elements (e.g. `<html>`, `<head>`, etc).
1. Clear the Drupal cache:
   - `docker exec -it fd2_farmdata2 drush cc all`
1. Visit the FarmData2 home page when logged in as a _Farm Worker_, a _Farm Manager_ or as `admin`.  Your new sub-tab should now be visible under the FD2 Field Kit tab.
   - If it is there are likely syntax errors in the `fd2_field_kit.module` file or in your `html` file.  You can check the Drupal error logs for helpful information:
     - http://localhost/admin/reports
1. Replace the _dummy code_ in your html file with the code for your form.
   - You will define the content and behavior of your form in the 'html' file you named earlier. This file can contain any valid html code including CSS and JavaScript. Sub-forms typically (e.g. `example.html') use [Vue.js](https://vuejs.org/), [Axios](https://github.com/axios/axios) and the [FarmOS API](https://farmos.org/development/api/) to interact with the FarmData2 database.
   - More information on these tools and resources for getting started with them are available in the [CONTRIBUTING.md](https://github.com/DickinsonCollege/FarmData2/blob/main/CONTRIBUTING.md) file.
1. Test your form using the [Cypress testing framework](https://www.cypress.io/) by creating a new `spec.js` file in `cypress\integration` directory.
   - More information about Cypress and resources for getting started with it are available in the [CONTRIBUTING.md](https://github.com/DickinsonCollege/FarmData2/blob/main/CONTRIBUTING.md) file.
