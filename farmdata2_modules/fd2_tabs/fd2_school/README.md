# FarmData2 School

FarmData2 School is a collection of activities that will guide you from an introduction to FOSS and FarmData2, through installation of FarmData2 and then through the use of each of the key technologies used in FarmData2. Each activity includes practice using the technologies within the context of FarmData2. Thus, you'll learn not only the technologies, but will get comfortable working within the FarmData2 developer environment as well.

If you use these activities, please keep in mind that they were created for use as assignments in courses. Thus, you shouldn't feel obligated to answer every question and you should skip over any class specific parts that don't make sense outside of a course. When you have completed all of the activities you'll be well on your way to being a FarmData2 developer.  In addition, while these activites will be updated as FarmData2 evolves, they may not be fully in synch with the latest code in the repository.  If you run in to any issues, connect with the community on Zulip and ask a question.

## The Activities

- 01 - Introduction to FOSS & The FarmData2 Community [ [docx](activities/01-IntroToFarmData2.docx) | [pdf](activities/01-IntroToFarmData2.pdf) ]
- 02 - FarmData2 Developer Install [ [docx](activities/02-DeveloperInstall.docx) | [pdf](activities/02-DeveloperInstall.pdf) ]
- 03 - HTML Technology Spike [ [docx](activities/03-HTMLSpike.docx) | [pdf](activities/03-HTMLSpike.pdf) ]
- 04 - Vue Data Binding Technology Spike [ [docx](activities/04-VueDataBindingSpike.docx) | [pdf](activities/04-VueDataBindingSpike.pdf) ]
- 05 - Vue Events and JavaScript Functions Technology Spike [ [docx](activities/05-VueJSEventsSpike.docx) | [pdf](activities/05-VueJSEventsSpike.pdf) ]
- 06 - Web APIs Technology Spike [ [docx](activities/06-WebAPIsSpike.docx) | [pdf](activities/06-WebAPIsSpike.pdf) ]
- 07 - FarmOS API Technology Spike [ [docx](activities/07-FarmOSAPISpike.docx) | [pdf](activities/07-FarmOSAPISpike.pdf) ]
- 08 - Cascading Style Sheets and Bootstrap (in development)
- 09 - Element Selectors and Cypress Testing (in development)

## The FarmData2 School Module ###

FarmData2 is built using Drupal modules that run within FarmOS. For example, the _FieldKit_ and _BarnKit_ tabs in the FarmData2 interface are created by modules. The _FD2 School_ tab is created by the `fd2_school` module and provides a space for you to work through the FarmData2 School Activites.

### Adding a Sub-Tab to the FD2 School Tab ###

Most FarmData2 front-end development will consist of adding a new sub-tab to one of the FarmData2 tabs (i.e. the _Field Kit_ or the _Barn Kit_).  This section discusses how to add such a sub-tab to the FarmData2 School tab.

Each FarmData2 School Activity will ask you to add a new sub-tab to the FarmData2 School Tab. To do this you will need to edit the `fd2_school` module. The following steps will guide you through that process.

1. Ensure that a development instance of FarmData2 is up and running. See [INSTALL.md](https://github.com/DickinsonCollege/FarmData2/blob/main/INSTALL.md) for full instructions.
1. Find the `fd2_school` directory in the `farmdata2_modules/fd2_tabs` directory.
1. Open the the `fd2_school.module` file.
1. Modify the `fd2_school_menu` function by adding the code that creates the `$items` entry for the `XYZ` sub tab as shown below:

    ```php
    <?php
    // ... omitted code ...
    function fd2_school_menu() {
       
        // ... omitted code ...
        
        // Add items blocks for new sub-tabs here.

        // Add a sub-tab named XYZ with content in xyz.html.
        $items['farm/fd2-school/xyz'] = array(
            'title' => 'XYZ',
            'type' => MENU_LOCAL_TASK,
            'page callback' => 'fd2_school_view',
            'page arguments' => array('xyz.html'),
            'access arguments' => array('view fd2 school'),
            'weight' => 110,
        );

        return $items;
    };
    // ... omitted code ...
    ```

   - Customize the following four elements of the `array` as necessary for the new sub-tab:
     - `farm/fd2-school/xyz`: This is the URL to directly access the sub-tab. Replace `xyz` with the URL you want for your sub-tab (e.g. `html` for the first activity).
     - `title`: This defines the name of the sub-tab that appears in the _FD2 School_ tab.  Replace `XYZ` with the text you want to appear as the sub-tab title (e.g. `HTML` for the first activity).
     - `page arguments`: This is the file that provides the content for the sub-tab. Replace `xyz.html` with the name of the file that contains the code for your new sub-tab (e.g. `html.html` for the first activity).
     - `weight`: The weight controls the placement of the sub-tabs with respect to the others that appear.  Sub-tabs with lower weights appear further left and those with higher weights appear further right.
1. Create the `.html` file you named in the `page arguments` above. 
1. Insert some _dummy code_ for now just to get the sub-tab up and visible. For example:
   ```html
    <p>This is my sub-tab</p>
   ```
    - Note that it is not necessary to include all of the html elements (e.g. `<html>`, `<head>`, `<body>` etc).  The code that you provide in this file is inserted into the body of the page when it is generated by Drupal.
1. Clear the Drupal cache:
   - `docker exec -it fd2_farmdata2 drush cc all`
1. Visit the FarmData2 home page when logged in as a _Farm Worker_, a _Farm Manager_ or as `admin`.  Your new sub-tab should now be visible under the _FD2 School_ tab.  You can find the login credentials that are available in the developement environment on the [INSTALL.md](https://github.com/DickinsonCollege/FarmData2/blob/main/INSTALL.md) page.
   - If your tab does not appear, there are likely syntax errors in the `fd2_school.module` file or in your `.html` file.  You can check the Drupal error logs for helpful information: http://localhost/admin/reports
1. Work through the FarmData2 School Activity and replace the _dummy code_ in your `.html` file with the code created in the activity.
