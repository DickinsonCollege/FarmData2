# FarmData2 School

FarmData2 School is a collection of activities that will guide you from an introduction to FOSS and FarmData2, through installation of FarmData2, and then through the use of each of the key technologies used in FarmData2. Each activity includes practice using the technologies within the context of FarmData2. Thus, you'll learn not only the technologies, but will get comfortable working within the FarmData2 developer environment as well.

If you use these activities, please keep in mind that they were created for use as assignments in courses. Thus, you shouldn't feel obligated to answer every question, and you should skip over any class specific parts that don't make sense outside of a course. When you have completed all of the activities you'll be well on your way to being a FarmData2 developer. In addition, while these activities will be updated as FarmData2 evolves, they may not be fully in sync with the latest code in the repository. If you run in to any issues, connect with the community on Zulip and ask a question.

## The Activities

- 00 - Introduction to FOSS & The FarmData2 Community [ [docx](activities/00-IntroToFarmData2.docx) | [pdf](activities/00-IntroToFarmData2.pdf) ]
- 01 - FarmData2 Developer Install [ [docx](activities/01-DeveloperInstall.docx) | [pdf](activities/01-DeveloperInstall.pdf) ]
- 02 - HTML Technology Spike [ [docx](activities/02-HTMLSpike.docx) | [pdf](activities/02-HTMLSpike.pdf) ]
- 03 - Vue Data Binding Technology Spike [ [docx](activities/03-VueDataBindingSpike.docx) | [pdf](activities/03-VueDataBindingSpike.pdf) ]
- 04 - Vue Events and JavaScript Functions Technology Spike [ [docx](activities/04-VueJSEventsSpike.docx) | [pdf](activities/04-VueJSEventsSpike.pdf) ]
- 05 - Web APIs Technology Spike [ [docx](activities/05-WebAPIsSpike.docx) | [pdf](activities/05-WebAPIsSpike.pdf) ]
- 06 - FarmOS API Technology Spike [ [docx](activities/06-FarmOSAPISpike.docx) | [pdf](activities/06-FarmOSAPISpike.pdf) ]
- 07 - Cypress End-To-End Testing Spike [ [docx](activities/07-CypressSpike.docx) | [pdf](activities/07-CypressSpike.pdf) ]
- 08 - FarmData2 Components Spike [ [docx](activities/08-FD2ComponentsSpike.docx) | [pdf](activities/08-FD2ComponentsSpike.pdf) ]

## The FarmData2 School Module ###

FarmData2 is built using Drupal modules that run within FarmOS. For example, the _FieldKit_ and _BarnKit_ tabs in the FarmData2 interface are created by modules. The _FD2 School_ tab is created by the `fd2_school` module and provides a space for you to work through the FarmData2 School Activities.

### Adding a Sub-Tab to the FD2 School Tab ###

Most FarmData2 front-end development will consist of adding a new sub-tab to one of the FarmData2 tabs (i.e. the _Field Kit_ or the _Barn Kit_). This section discusses how to add such a sub-tab to the FarmData2 School tab specifically.

Each FarmData2 School Activity will ask you to add a new sub-tab to the FarmData2 School Tab. To do this you will need to edit the `fd2_school.module` file. The following steps will guide you through that process.

1. Ensure that a development instance of FarmData2 is up and running. See [INSTALL.md](https://github.com/DickinsonCollege/FarmData2/blob/main/INSTALL.md) for full instructions.

2. Change into the directory containing your local FarmData2 repository and ensure that you are working on the feature branch requested for the FD2 School lesson on which you are working.

3. Change to the `fd2_school` directory in the `farmdata2/farmdata2_modules/` directory.

4. Create a sub-directory for your new sub-tab. The instructions below will use the generic `xyz` as this name. You should replace `xyz` with the name of the sub-tab as indicated in the FD2 School activity you are working on.

5. Use VSCodium in the development environment to open the the `fd2_school.module` file in the `farmdata2/farmdata2_modules/fd2_school` directory.

6. Modify the `fd2_school_menu` function by adding the code that creates the `$items` entry for the `XYZ` sub tab as shown below:  

    ```php
    <?php
    // ... omitted code ...
    function fd2_school_menu() {
       
        // ... omitted code ...
        
        // Add items blocks for new sub-tabs here.

        // Add a sub-tab named XYZ with content in ./xyz/xyz.html.
        $items['farm/fd2-school/xyz'] = array(
            'title' => 'XYZ',
            'type' => MENU_LOCAL_TASK,
            'page callback' => 'fd2_school_view',
            'page arguments' => array('xyz'),
            'access arguments' => array('view fd2 school'),
            'weight' => 110,
        );

        return $items;
    };
    // ... omitted code ...
    ```

   - Customize the following four elements of the `array` as necessary for your new sub-tab:
     - `farm/fd2-school/xyz`: This is the URL to directly access the sub-tab. Replace `xyz` with the URL you want for your sub-tab (e.g. `html` for the first activity).
     - `title`: This defines the name of the sub-tab that appears in the _FD2 School_ tab. Replace `XYZ` with the text you want to appear as the sub-tab title (e.g. `HTML` for the first activity).
     - `page arguments`: Replace `xyz` with the name of the directory that you created for the sub-tab you are creating.
     - `weight`: The weight controls the placement of the sub-tabs with respect to the others that appear. Sub-tabs with lower weights appear further left and those with higher weights appear further right. Choose weights such that sub-tabs for later FD2 School activities should appear to the right of earlier ones.

7. Change into the directory for your sub-tab.

8. Create an `.html` file inside the sub-tab directory. The name of the `.html` file must match the name of the direcotry. For example, if the directory name is `xyz` then the filename must be `xyz.html`.

9. Insert some _dummy code_ into the `.html` file for now just to get the sub-tab up and visible. For example:
   ```html
    <p>This is my sub-tab</p>
   ```
    - Note that it is not necessary to include all of the html elements (e.g. `<html>`, `<head>`, `<body>` etc). The code that you provide in this file is inserted into the `<body>` of the page when it is generated by Drupal.

10. Clear the Drupal cache with the command: `clearDrupalCache` 
    - You will need to clear the Drupal cache any time you make a change to a `.module` file. However, you will not need to clear this cache when you change the `.html` files.

11. Visit the FarmData2 home page when logged in as a _Farm Worker_, a _Farm Manager_, or as `admin`. Your new sub-tab should now be visible under the _FD2 School_ tab.
    - You can find the login credentials that are available in the development environment on the [INSTALL.md](https://github.com/DickinsonCollege/FarmData2/blob/main/INSTALL.md) page.
    - If your tab does not appear, there are likely syntax errors in the `fd2_school.module` file or in your `.html` file. You can check the Drupal error logs for helpful information: `http://fd2_farmdata2/admin/reports`
    
12. Work through the FarmData2 School Activity and replace the _dummy code_ in your `.html` file with the code created in the activity.
