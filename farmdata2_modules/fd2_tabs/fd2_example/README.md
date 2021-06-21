# FarmData2 Modules #

FarmData2 is built using Drupal modules that run within FarmOS. The _FieldKit_ and _BarnKit_ tabs in the FarmData2 interface are created by modules. The _FD2 Example_ tab is created by a sample module and can be used as a sandbox in which to learn about and experiment FarmData2 modules like those that produce the _FieldKit_ and _BarnKit_ tabs.

## FarmData2 Module Structure ##

As mentioned, each of the tabs in the FarmData2 interface are created by Drupal modules. Each FarmData2 module is defiend in its own directory within the `farmdata2_modules/fd2_tabs` directory (e.g. `fd2_barn_kit`, `fd2_example`, `fd2_field_kit`).

A FarmData2 module named `xyz` would include a folder within `farmdata2_modules/fd2_tabs` named `xyz`. That folder will contain at least the following files and directories, where `xyz`, `abc` and `pqr` are simply place holders and should be replaced with module specific names.
- `fd2_xyz.info`: Defines the module `xyz` so that it is recognized by Drupal.
- `fd2_xyz.module`: Contains the PHP implementation of the `xyz` module. This code determines where and when the tab is visible based on the user's role (e.g. `admin`, _manager_, _worker_ or _guest_). It also defines the sub-tabs and their content.
- `abc.html`: The content for a sub-tab `abc` within the `xyz` module (e.g. `info.html`, `ex1.html`).
- `abc.spec.js`: A test file containing end-to-end tests for the `abc.html` page.  The end-to-end tests are written using the Cypress testing tools (more info below). If multiple test files are used for the `abc.html` file, they should be named `abc.pqr.spec.js` where `pqr` clarifies the testing performed by the file. Multiple additional . and names can be used as necessary, but the filename of the test must end with `.spec.js` in order to be recognized by the FarmData2 Cypress configuration.
- `cypress`: A directory containing additional module level end-to-end tests for the `xyz` module. These are tests that are important for the module but that are not associated with a specific sub-tab (i.e. `html` file). These  test files must also be named `*.spec.js` to be recognized by the FarmData2 Cypress configuration.

### Hiding the _FD2 Example_ Tab ###

The _FD2 Example_ tab is created by the `fd2_example` module and is enabled by default by the [developer install](https://github.com/DickinsonCollege/FarmData2/blob/main/INSTALL.md#developer_install). This module and tab provide a sandbox for learning and experimentation with FarmData2 modules. The associated _FD2 Example_ tab will not appear in production installs. Developers wanting to mimic a production environment for demonstrations can hide the _FD2 Example_ tab by disabling the `fd2_example` module as follows:

1. Log into FarmData2 as `admin`
1. Click `Manage`
1. CLick `Modules`
1. Click `FarmData2` in the left column.
1. Click to turn the `FarmData2 Example` module off.
1. Click `Save configuration`

When returning to the home screen the _FD2 Example_ tab should no longer be visible.  The _FD2 Example_ tab can be reenabled by a similar process.

### Adding New Sub-Tabs to a FarmData2 Module ###

Most FarmData2 front-end deveopment will consist of adding a new sub-tab to one of the FarmData2 tabs (i.e. the _Field Kit_ or the _Barn Kit_).  This section discusses how to add such a sub-tab.

To add a new sub-tab to the `xyz` module:
1. Ensure that a development instance of FarmData2 is up and running. See [INSTALL.md](https://github.com/DickinsonCollege/FarmData2/blob/main/INSTALL.md) for full instructions.
1. Edit the `fd2_xyz.module` file to add a new `array` to the `$items` array for the new sub-tab.  The `array` for the _Ex1_ tab (shown below) is a good example to work from:
   ```php
   <?php
   // ... omitted code ...
   function fd2_example_menu() {
       
       // ... omitted code ...

       $items['farm/fd2-example/ex1'] = array(
         'title' => 'Ex1',
         'type' => MENU_LOCAL_TASK,
         'page callback' => 'fd2_example_view',
         'page arguments' => array('ex1.html'),
         'access arguments' => array('View FD2 Example'),
         'weight' => 100,

         // ... omitted code ...
       );

       // ... omitted code ...
   };
   // ... omitted code ...
   ```
   - Four elements of the `array` must be customized for your new sub-tab:
     - `farm/fd2-example/ex1`: This is the URL to directly access the _Ex1_ sub-tab. Replace `ex1` with the URL you want for your sub-tab.
       - Note: This string also controls the placement of the _FD2 Example_ and _Ex1_ tabs. The _FD2 Example_ tab will appear on the _Farm_ menu, which is where the _Dashboard_ tab also appears. The _Ex1_ tab will appear as a sub-tab on the _FD2 Example_ tab. The value `farm` cannot be changed. But, `fd2-example` and `ex1` can.  In particular, they are not required to match the filenames. For example, `fd2-example` does not have to match the filename `fd2_example.module` and `ex1` does not have to correspond to `ex1.html`. However, it is a good convention to follow.
     - `title`: This defines the name of the sub-tab that appears in the _Example_ module's tab.  Replace `Ex1` with the text you want to appear as the sub-tab title.
     - `page arguments`: This is the file that provides the content for the sub-tab. Replace `ex1.html` with the name of the `.html` file that contains the code for your new sub-tab.
     - `weight`: The weight controls the placement of the sub-tabs with respect to the others that appear.  Sub-tabs with lower weights appear further left and those with higher weights appear further right.
1. Create the `.html` file you named in the `page arguments` above. Insert some _dummy code_ for now just to get the sub-tab up and visible. For example:
   ```html
    <p>This is my sub-tab</p>
   ```
    - Note that it is not necessary to include all of the html elements (e.g. `<html>`, `<head>`, `<body>` etc).  The code that you provide in this file is inserted into the body of the page when it is generated by Drupal.
1. Clear the Drupal cache:
   - `docker exec -it fd2_farmdata2 drush cc all`
1. Visit the FarmData2 home page when logged in as a _Farm Worker_, a _Farm Manager_ or as `admin`.  Your new sub-tab should now be visible under the _FD2 Example_ tab.  You can find the login credentials that are available in the developement environment on the [INSTALL.md](https://github.com/DickinsonCollege/FarmData2/blob/main/INSTALL.md) page.
   - If your tab does not appear, there are likely syntax errors in the `fd2_example.module` file or in your `.html` file.  You can check the Drupal error logs for helpful information: http://localhost/admin/reports
1. Replace the _dummy code_ in your `.html` file with the code for your new sub-tab. This file can contain any valid html code including CSS, JavaScript, Vue.js, etc...
   - Sub-tabs typically (e.g. `ex1.html`) use Vue.js, Axios and the FarmOS API to interact with the FarmData2 database. More information on these tools and resources for getting started with them are available in the [ONBOARDING.md](https://github.com/DickinsonCollege/FarmData2/blob/main/ONBOARDING.md) file.

### JavaScript and CSS Libraries ###

JavaScript and CSS libraries can be included in module by adding them to the module configuration files (i.e. `.info` and `.module`).  

#### Local Libraries ####

Local libraries, such as those in the `fd2_tabs/resources` directory are included by adding them to the `.info` file. For example, in the `fd2_example.info` file the following lines add a css library and a JavaScript library for a Vue Component:
```php
stylesheets[all][] = '../resources/fd2.css'
scripts[] = '../resources/dropdownWithAllComponent.js'
```

#### Remote or CDN Libraries ####

Libraries such as those served from Content Delivery Networks (CDN) are included by adding them to the `<module>_preprocess_page()` function in the `.module` file.  For example, in the `fd2_example.module` file the following lines add the Vue.js and Axios libraries:
```php
drupal_add_js('https://unpkg.com/vue/dist/vue.min.js','external');
drupal_add_js('https://unpkg.com/axios/dist/axios.min.js','external');
```

### Pre-defined Module Variables ###

Drupal Modules can pass variables from the farmOS/Drupal system through to the sub-tab.  All of the current modules define two such variables:
  - `fd2UserID`: The numeric id of the user that is currently logged in to FarmData2.
  - `fd2UserName`: The text user name of the user that is currently logged in to FarmData2.

These variables are global and can be used in scripts and in the Vue instance within the page.  Additional variables can be added to a module by adding their definitions to the `<module>_preprocess_page()` method in the appropraite `.module` file.  See the `fd2_example_preprocess_page()` function in the  `fd2_example.module` file for an example.

## Vue Components ##

Vue Components help to reduce code duplication, speed up development, and create a consistent look and feel across all of the sub-tabs in FarmData2. Information about the creation of Vue Components is available in the [ONBOARDING.md](https://github.com/DickinsonCollege/FarmData2/blob/main/ONBOARDING.md) file.

Custom Vue Components used in FarmData2 are contained in the `fd2_tabs/resources` folder.  Each component is defined in a `.js` file. The filename for components should match `*Component.js` (e.g. `dropdownWithAllComponent.js`)  Each component is also accompanied by a file with a name of the same prefx but with the suffix `.spec.comp.js` that contains Cypress component tests for the component (e.g. `dropdownWithAllComponent.spec.comp.js`).  See below for more information on the component tests.

### Creating Vue Components ### 

In addition to the standard implementation of a Vue Component as a JavaScript object (see `DropdownWithAllComponent.js`) each Vue Component for FarmData2 exports the object as a [CommonJS Module](https://flaviocopes.com/commonjs/) so that it can be imported into the Cypress Component test framework. For example the snippet of code below appears at the bottom of the `DropdownWithAllComponent.js` file to export the `DropdownWithAllComponent`.

```JavaScript
try {
    module.exports = {
        DropdownWithAllComponent: DropdownWithAllComponent
    }
}
catch {}
```

- More Details: Drupal 7 adds JavaScript files to a page using a `<script>` tag thus there is no need for this statement to use the component in a FarmData2 page.  Howver, the Cypress Component testing tools require that a component under test be imported from a module. Thus the `modulde.export` statement is necessary to make it possible to test the component.  So, this little hack basically just makes it possible for us to use the same `.js` file both in FarmData2 through Drupal and in the Cypress Component testing tools.

#### Creating Nested Vue Components ####

When a _parent_ Vue component contains a nested _child_ Vue component the parent component needs to have access to the child component.  Within Drupal this happens as explained below.  To support testing of nested components it is necessary that the parent comonent `import` the child component when it is running with the Cypress copmponet test runner but not when being used in a FarmData2 page served by Drupal. To accompolish this you will add a `try/catch` to the top of any Vue component file that uses a nested component.  For example, the code below appears at the top of the `DateRandeSelectionComponent.js` file becuase that component uses the `DateSelectionComponent`:

```JavaScript
try {
    FarmData2
}
catch(err) {
    var DateComps = require("./DateSelectionComponent.js")
    DateSelectionComponent = DateComps.DateSelectionComponent
}
```

  - More Details: The variable `FarmData2` is defined on pages that are running within the FarmData2 system (i.e. those served by Drupal).  It however, is not defined when the Cypress component test runner is running.  Thus, the `require` will only execute when the component is beging tested in the Cypress component test runner.

### Using a Vue Component ###

To use a Vue component within a sub-tab the `.js` file for the component must be added to the `scripts` array in the module's `.info` file.  For example, the following line in the `fd2_example.info` file makes the `DropdownWithAllComponent` available in the `.html` pages that define the sub-tabs on the `FD2 Example` tab:
```php
scripts[] = '../resources/dropdownWithAllComponent.js'
```

#### Using Nested Vue Components #### 

If a Vue component contains a nested Vue compnent then both the nested component and the parent component must be added to the `scripts[]`. The nested comonent must be listed before the parent component.  For example, the following lines make the `DateSelectionComponent` and the `DateRandeSelectionComponent` avaialable on the `FD2 Example` tab:
```php
scripts[] = '../resources/DateSelectionComponent.js'
scripts[] = '../resources/DateRangeSelectionComponent.js'
```

## JavaScript Libraries ##

FarmData2 also uses a number of custom JavaScript libraries that are contained in the `farmdata2_modules/fd2_tabs/resources` folder.  Similar to what was done with Vue comonents and nested Vue components there are blocks of code that will appear at the top and bottom of each JavaScript file so that they can be served by Drupal and be tested within the Cypress End-to-End test runner.

Any modules that are needed by the library will be `required` by a block of code at the top of the file.  For example, the code in the `FarmOSAPI.js` file uses the `axios` module.  These lines appear at the top of that file:

```JavaScript
try {
    FarmData2
}
catch {
    axios = require('axios')
}
```

The JavaScript file will also export any variables, objects or functions that it contains so that they can be exercised by Cypress test.  For example, the `FarmOSAPI.js` file exports the `getAllPages` function using the following code that appears at the end of the file:

```JavaScript
try {  
    module.exports = {
        getAllPages: getAllPages
    }
}
catch {}
```

## Testing with Cypress ##

FarmData2 modules, sub-tabs and components are all tested using the Cypress testing framework. Having a complete set of tests facilitates future changes and the evolution of FarmData2 by makeing it easy to identify any functionality that has been broken by changes. More information about Cypress and resources for getting started with it are available in the [ONBOARDING.md](https://github.com/DickinsonCollege/FarmData2/blob/main/ONBOARDING.md#cypress) file.  

### End-to-End Testing ###

Cypress end-to-end tests are used to confirm that modules and sub-tabs operate correctly. They do this by interacting with the live development instance of FarmData2.  Cypress end-to-end tests will typically log into FarmData2 as a specific user, visit a specific page, interact with the elements of that page (e.g. click buttons, enter text, etc) and then make assertions about the resulting changes to the page. 

Each sub-tab will have have an associated set of end-to-end tests. For example, `ex1.spec.js` file contains the end-to-end tests for the sub-tab defined by the `ex1.html` file (i.e. the _Ex1_ sub-tab on the _FD2 Example_ tab). Note that, by convention, the name of the `spec` file has the same prefix as the sub-tab's `.html` file.  If there are multiple test files for the same `html` file use additional prefixes to identify their purpose (i.e. `ex1.pqr.spec.js`, where `pqr` would provide addtional clarifying information about the tests in that file.

The `cypress` directory within a module directory (e.g.`fd2_example/cypress`) will contain _module level_ tests. These are tests that apply to the main tab rather than to individual sub-tabs.  For example, in the `fd2_example` module:
   - `fd2vars.spec.js` tests that the Predefined Module Variables (discuessed above) exist and are accessible.
   - `visibility.spec.js` tests that the _FD2 Example_ tab is visible for the `admin`, _manager_ and _worker_ users but not for a _guest_.

Resources and references for writing Cypress end-to-end tests can be found in the [ONBOARDING.md](https://github.com/DickinsonCollege/FarmData2/blob/main/ONBOARDING.md#cypress) file.  

#### Running the End-To-End Tests ####

FarmData2 provides support for running the end-to-end tests using the Cypress test runner in a Docker container. The Cypress end-to-end test runner is launched from the `farmdata2_modules` directory using the command:
   - `./test_runner.bash e2e`  

Note that the Docker image for the Cypress test runner will be built the first time it is launched. This may take a number of minutes while the base image is fetched and its contents customized for running Cypress tests. A cached docker image will be used for subsequent launches, which will be much faster.

### Component Testing ###

Cypress component tests are used to check the behavior of custom Vue Compnents in isolation.  This is done by mounting the Vue Component into the test runner, interacting with it (similar to the end-to-end tests) and making assertions about changes in the component and emitted events.

Each component in the `fd2_tabs/resources` folder (e.g. `dropdownWithAllComponent.js`) will be accompanied by Cypress component tests (e.g. `dropdownWithAllComponent.spec.comp.js`). All of the tests for the component are contained in the `.spec.comp.js` file.

Resources and references for writing Cypress tests for Vue Components can be found in the [ONBOARDING.md](https://github.com/DickinsonCollege/FarmData2/blob/main/ONBOARDING.md#cypress) file.  

#### Running the Component Tests ####

The Cypress test runner (discussed above) also provides support for running Vue Component tests in the same Docker container. The Vue Component tests are run from the `farmdata2_modules` directory using the command:
   - `./test_runner.bash ct`  

As noted above if this is the first time the Cypress test runner is launched it will take a number of minutes. Subsequent launches will be much faster.