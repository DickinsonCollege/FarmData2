# FarmData2 School

## Activities

The activities will guide you from an introduction to FOSS and FarmData2, through installation of FarmData2 and then through the use of each of the key technologies used in FarmData2. Each activity includes practice using the technologies within the context of FarmData2. Thus, you'll learn not only the technologies, but will get comfortable working within the FarmData2 developer environment as well.

If you use these activities, please keep in mind that they were created for use as assignments in courses. Thus, you shouldn't feel obligated to answer every question and you should skip over any class specific parts that don't make sense outside of a course. When you have completed all of the activities you'll be well on your way to being a FarmData2 developer.  In addition, while these activites will be updated as FarmData2 evolves, they may not be fully in synch with the latest code in the repository.  If you run in to any issues, connect with the community on Zulip and ask a question.

- 01 - Introduction to FOSS & The FarmData2 Community [ [docx](media/Activities/01-IntroToFarmData2.docx) | [pdf](media/Activities/01-IntroToFarmData2.pdf) ]
- 02 - FarmData2 Developer Install [ [docx](media/Activities/02-DeveloperInstall.docx) | [pdf](media/Activities/02-DeveloperInstall.pdf) ]
- 03 - HTML Technology Spike [ [docx](media/Activities/03-HTMLSpike.docx) | [pdf](media/Activities/03-HTMLSpike.pdf) ]
- 04 - Vue Data Binding Technology Spike [ [docx](media/Activities/04-VueDataBindingSpike.docx) | [pdf](media/Activities/04-VueDataBindingSpike.pdf) ]
- 05 - Vue Events and JavaScript Functions Technology Spike [ [docx](media/Activities/05-VueJSEventsSpike.docx) | [pdf](media/Activities/05-VueJSEventsSpike.pdf) ]
- 06 - Web APIs Technology Spike [ [docx](media/Activities/06-WebAPIsSpike.docx) | [pdf](media/Activities/06-WebAPIsSpike.pdf) ]
- 07 - FarmOS API Technology Spike [ [docx](media/Activities/07-FarmOSAPISpike.docx) | [pdf](media/Activities/07-FarmOSAPISpike.pdf) ]
- 08 - Cascading Style Sheets and Bootstrap (in development)
- 09 - Element Selectors and Cypress Testing (in development)

### Adding a Sub-Tab to the FarmData2 School Module ###

Most FarmData2 front-end deveopment will consist of adding a new sub-tab to one of the FarmData2 tabs (i.e. the _Field Kit_ or the _Barn Kit_).  This section discusses how to add such a sub-tab to the FarmData2 School tab.

To add a new sub-tab to the `xyz` module:
1. Ensure that a development instance of FarmData2 is up and running. See [INSTALL.md](https://github.com/DickinsonCollege/FarmData2/blob/main/INSTALL.md) for full instructions.
1. Edit the `fd2_xyz.module` file to add a new `array` to the `$items` array for the new sub-tab.  The `array` for the _UI_ tab (shown below) is a good example to work from:
   ```php
   <?php
   // ... omitted code ...
   function fd2_example_menu() {
       
       // ... omitted code ...

       $items['farm/fd2-example/ui'] = array(
         'title' => 'UI',
         'type' => MENU_LOCAL_TASK,
         'page callback' => 'fd2_example_view',
         'page arguments' => array('ui.html'),
         'access arguments' => array('View FD2 Example'),
         'weight' => 120,
       );

       // ... omitted code ...
   };
   // ... omitted code ...
   ```
   - Four elements of the `array` must be customized for your new sub-tab:
     - `farm/fd2-example/ui`: This is the URL to directly access the _UI_ sub-tab. Replace `ui` with the URL you want for your sub-tab.
       - Note: This string also controls the placement of the _FD2 Example_ and _UI_ tabs. The _FD2 Example_ tab will appear on the _Farm_ menu, which is where the _Dashboard_ tab also appears. The _UI_ tab will appear as a sub-tab on the _FD2 Example_ tab. The value `farm` cannot be changed. But, `fd2-example` and `UI` can.  In particular, they are not required to match the filenames. For example, `fd2-example` does not have to match the filename `fd2_example.module` and `UI` does not have to correspond to `ui.html`. However, it is a good convention to follow.
     - `title`: This defines the name of the sub-tab that appears in the _Example_ module's tab.  Replace `UI` with the text you want to appear as the sub-tab title.
     - `page arguments`: This is the file that provides the content for the sub-tab. Replace `ui.html` with the name of the `.html` file that contains the code for your new sub-tab.
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
   - Sub-tabs typically (e.g. `ui.html`) use Vue.js, Axios and the FarmOS API to interact with the FarmData2 database. More information on these tools and resources for getting started with them are available in the [ONBOARDING.md](https://github.com/DickinsonCollege/FarmData2/blob/main/ONBOARDING.md) file.
