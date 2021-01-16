## FarmData2 Example Module ##

FarmData2 is built using Drupal modules that run within FarmOS. The _FieldKit_ and _BarnKit_ tabs in the FarmData2 interface are created by modules. This `fd2_example` module provides a sample module as a sandbox in which to learn about and experiment FarmData2 modules like those that produce the _FieldKit_ and _BarnKit_ tabs.

### FarmData2 Module Structure ###

The essential elements of a FarmData2 module named `xyz` would include a folder within `farmdata2_modules/fd2_tabs` named `xyz` containing the following files and directories:
- `fd2_xyz.info`: Defines the module `xyz` so that it is recognized by Drupal.
- `fd2_xyz.module`: Contains the PHP implementation of the `xyz` module. This code determines where and when the tab is visible based on the user's role. It also defines the sub-tabs and their content.
- `abc.html`: The content for a sub-tab `abc` within the `xyz` module (e.g. `info.html`, `ex1.html`).
- `cypress`: A directory containing end-to-end tests for the `xyz` module using the [Cypress testing framework](https://www.cypress.io).
  - `cypress.json`: The configuration file for the Cypress tests.
  - `cypress\integration\abc.spec.js`: The test code for the `abc` sub-tab. There will be at least one `spec` file for each sub-tab (e.g. `info.spec.js`, `ex1.spec.js`) that fully tests its functionality.

### Adding a New Sub-Tab to a FarmData2 Module ###

To add a new sub-tab to the `xyz` module:
1. Ensure that a development instance of FarmData2 is up and running. See [INSTALL.md](https://github.com/DickinsonCollege/FarmData2/blob/main/INSTALL.md) for full instructions.
1. Edit the `fd2_xyz.module` file to add a new `array` to the `$items` array for the new sub-tab.  The `array` for the _Ex1_ tab (shown below) is a good example to work from:
   ```php
   <?php
   // ...
   function fd2_example_menu() {
       $items['farm/fd2-example/ex1'] = array(
         'title' => 'Ex1',
         'type' => MENU_LOCAL_TASK,
         'page callback' => 'fd2_example_view',
         'page arguments' => array('ex1.html'),
         'access arguments' => array('View FD2 Example'),
         'weight' => 100,
       );
   };
   // ...
   ```
   - Three elements of the `array` must be customized for your form:
     - `farm/fd2-example/ex1`: This is the URL to directly access the _Ex1_ sub-tab. Replace `ex1` with the URL you want for your sub-tab.
       - Note: This string also controls the placement of the _FD2 Example_ and _Ex1_ tabs. The _FD2 Example_ tab will appear on the _Farm_ menu, which is where the _Dashboard_ tab also appears. The _Ex1_ tab will appear as a sub-tab on the _FD2 Example_ tab. The value `farm` cannot be changed. But, `fd2-example` and `ex1` can.  In particular, they are not required to match the filenames. For example, `fd2-example` does not have to match the filename `fd2_example.module` and `ex1` does not have to correspond to `ex1.html`. However, it is a good convention to follow.
     - `title`: This defines the name of the sub-tab that appears in the _Example_ module's tab.  Replace `Ex1` with the text you want to appear as the sub-tab title.
     - `page arguments`: This is the file that provides the content for the sub-tab. Replace `ex1.html` with the name of the `.html` file for your new sub-tab.
1. Create the `.html` file you named above. Insert some _dummy code_ for now just to get the sub-tab up and visible. For example:
   ```html
   <body>
      <p>This is my sub-tab</p>
   </body>
   ```
   - Note that it is not necessary to include all of the html elements (e.g. `<html>`, `<head>`, etc).
1. Clear the Drupal cache:
   - `docker exec -it fd2_farmdata2 drush cc all`
1. Visit the FarmData2 home page when logged in as a _Farm Worker_, a _Farm Manager_ or as `admin`.  Your new sub-tab should now be visible under the _FD2 Example_ tab.
   - If it is not, there are likely syntax errors in the `fd2_example.module` file or in your `.html` file.  You can check the Drupal error logs for helpful information:
     - http://localhost/admin/reports
1. Replace the _dummy code_ in your `.html` file with the code for your new sub-tab. This file can contain any valid html code including CSS, JavaScript, Vue.js, etc...
   - Sub-tabs typically (e.g. `ex1.html') use [Vue.js](https://vuejs.org/), [Axios](https://github.com/axios/axios) and the [FarmOS API](https://farmos.org/development/api/) to interact with the FarmData2 database. More information on these tools and resources for getting started with them are available in the [ONBOARDING.md](https://github.com/DickinsonCollege/FarmData2/blob/main/ONBOARDING.md) file.
1. Test your sub-tab using the [Cypress testing framework](https://www.cypress.io/) by creating a new `spec.js` file in the `cypress\integration` directory.
   - More information about Cypress and resources for getting started with it are available in the [ONBOARDING.md](https://github.com/DickinsonCollege/FarmData2/blob/main/ONBOARDING.md#cypress) file.
1. Launch the Cypress test runner using `./test_runner.bash`  Note: The Cypress test runner executes in a Docker container.  Thus, it may take a few moments for the runner to start, particularly the first time when the image must be fetched.

### Disabling the `fd2_example` Module ###

The `fd2_example` module is enabled by default by the [developer install](https://github.com/DickinsonCollege/FarmData2/blob/main/INSTALL.md#developer_install) to provide a sandbox for learning and experimentation with FarmData2 modules. However, the associated _FD2 Example_ tab does not appear in production installs. Developers wanting to mimic a production environment for demonstrations can disable the `fd2_example` module as follows:

1. Log into FarmData2 as `admin`
1. Click `Manage`
1. CLick `Modules`
1. Click `FarmData2` in the left column.
1. Click to turn the `FarmData2 Example` module off.
1. Click `Save configuration`

When returning to the home screen the _Example_ tab should no longer be visible.
