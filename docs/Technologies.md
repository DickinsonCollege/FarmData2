# Overview of FarmData2 Technologies #

This document provides an overview of the technologies used in FarmData2, describes the roles that they play, and provides some resources for learning the essentials of each.

## Overview ## 

Interacting with FarmData2 requires a basic familiarity with git and GitHub. FarmData2 development uses a fairly standard web technology stack including HTML, CSS, Bootstrap, JavaScript, and Vue.js. The front-end uses [Axios](https://github.com/axios/axios) to accesses FarmData2 data in a [MariaDB](https://mariadb.org/) database through the [FarmOS API](https://v1.farmos.org/development/api/) and a custom [Express API](https://expressjs.com/). End-to-end testing is done using the [Cypress framework](https://www.cypress.io/). The automation, configuration, and back-end development of FarmData2 use a number of other technologies including Drupal, drush, FarmOS, Docker, docker-compose, and bash scripting.

This document is intended to be used in two ways. When you are new to FarmData2, it is recommended that you work through this document from the top down. However, it is not essential that you fully master every tool and technology on the first pass. Rather, once you feel basically comfortable with a tool or technology (or if you already know it), skip to the next one.  Then later, while working on FarmData2 you can return to this document and jump directly to the relevant section(s) to find a reference or to learn a little bit more as needed.

## Preliminaries ##

Before continuing, if you haven't already, please review the [README](../README.md), the [CODE_OF_CONDUCT](../CODE_OF_CONDUCT.md), the [LICENSE](LICENSE.md) and the [CONTRIBUTING](../CONTRIBUTING.md) documents as they provide information that is important to getting started and to maintaining the FarmData2 community.

### Installation ###

The [INSTALL.md](INSTALL.md) file contains the instructions for doing a [Developer Install](INSTALL.md#developer-install). After you complete the developer install, FarmData2 will be setup and ready for you to work on.

## Communications ##  

The FarmData2 community uses [Zulip](https://zulip.com/) as its communication platform. Zulip is a group chat application that blends the benefits of asynchronous threaded discussions (e.g. a forum) with live chat.

Connecting with the [FarmData2 community on Zulip](https://farmdata2.zulipchat.com/) provides a place to ask questions of the project managers and the broader developer community.

  - Resources:
    - [Streams and Topics](https://zulip.com/help/about-streams-and-topics): An introduction to the two key features of Zulip. Once you understand streams and topics, Zulip is relatively easy to use.
    - [Zulip Home Page](https://zulip.com/): This page has a quick tour of Zulip's features that you can click through.
    - [User Documentation](https://zulip.com/help/): A comprehensive set of documentation on Zulip's use and features.

## Version Control and Repositories ##

The FarmData2 documentation and resources assume a basic facility with git, GitHub and a familiarity with the GitFlow branching workflow. You'll need to understand the steps outlined in the [CONTRIBUTNG](../CONTRIBUTING.md) document.

The following resources can be useful for learning what you'll need to know about git and GitHub:

  - Resources:
    - [Hello World](https://guides.github.com/activities/hello-world/): A first introduction to GitHub that will get you started if you haven't used it before.
    - [GitFlow Intro](https://guides.github.com/introduction/flow/): An introduction to an effective way of using GitHub (i.e. a _workflow_).  The following two guides walk through how to work with existing open source projects and essentially follow GitFlow:
      - [Step-by-step guide to contributing on GitHub](https://www.dataschool.io/how-to-contribute-on-github/)
      - [7 Steps to Get Started with Git](https://www.fosslife.org/7-steps-get-started-git).
    - [Git Immersion](https://gitimmersion.com/): A tutorial walks through a series of short hands-on exercises that provide practice with the key features of git.
    - [Pro Git Book](http://git-scm.com/book/en/v2) | [Learn Git Tutorial](https://www.tutorialspoint.com/git/index.htm): More detailed and comprehensive coverage of git's features and use.

## FarmData2 School ##

FarmData2 has been used in a number of undergraduate computer science courses, and activities have been developed to guide students through an introduction to front-end development in FarmData2.  If you are new to open source and FarmData2 or to any of the technologies that FarmData2 uses, working through these activities will be an efficient way to get up to speed. If you are a more experienced developer you might just pick and choose from these activities, or skip over them completely to the more general resources in the sections below. If you are an instructor for a course, these activities can provide a way to on-board your students to the project.  Please get in touch on Zulip if you are an instructor interested in using FarmData2 in a course, and we will be happy to help.

The FarmData2 School Activities and associated information can be found in the [README.md](https://github.com/DickinsonCollege/FarmData2/tree/main/farmdata2/farmdata2_modules/fd2_school/README.md) in the [FarmData2 School Module](https://github.com/DickinsonCollege/FarmData2/tree/main/farmdata2/farmdata2_modules/fd2_school).

## Development Environment ##

### Editors ###

The FarmData2 code and documentation can be edited with any editor.  However, for convenience, the FarmData2 installation includes ...

TODO: Write this for VSCodium.

<!--
a browser-based integrated development environment (IDE) based on [Eclipse Theia](https://theia-ide.org/).

To access the Theia IDE once the [FarmData2 development environment is running](INSTALL#developer-install), just open a browser tab and go to:
```
http://localhost:3000
```
When the IDE opens:
  1. Click "Open Workspace"
  1. Select the `FarmData2` directory
  1. Click "Open"

The explorer on the left will show the contents and structure of the FarmData2 repository. If you are familiar with other IDEs then using Theia should be relatively straight forward.

  - Resources:
    - [How to use Eclipse Theia as an IDE](https://eclipsesource.com/blogs/2019/10/04/how-to-use-eclipse-theia-as-an-ide/): An overview of Theia and its use ad an Integrated Development Environment.

As FarmData2 matures, utilities (e.g. linters and formatters) will be added to the provided Theia IDE. If you choose to use a different editor, all such utilities will be documented in the [INSTALL.md](INSTALL.md) file so that you can install the appropriate plugins for your editor.
-->


## Front-End Technologies ##

The majority of development for FarmData2 is front-end (i.e. browser-based).  This section outlines the key technologies that are used for this development.

### HTML ###

[Hypertext Markup Language (HTML)](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference) is the base language that is used to create web pages. It defines the structure of a page and allows page _elements_ (e.g. headings, paragraphs, lists, images, etc.) to be _tagged_ and labeled with _attributes_. The way that an element is tagged and labeled allows the browser (with [CSS](#css)) to determine how the content of the element should be displayed. Elements and attributes also allow [JavaScript](#javascript), [Vue.js](#vue.js) and [Cypress](#cypress) to interact with the page style, structure and content.

  - Resources:
    - [HTML Basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics): A great place to start if you have not worked with HTML before or want a refresher.
    - [Your first form](https://developer.mozilla.org/en-US/docs/Learn/Forms/Your_first_form): An introduction to HTML forms, which FarmData2 uses to collect input from the user (e.g. plantings, harvests, search criteria, etc.)
    - [HTML Tables](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables): An introduction to creating tables in HTML, which FarmData2 uses to display many of the different reports that can be generated.
    - [Introduction to HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML): A collection of guides and assessments that give a comprehensive introduction to HTML.
    - [HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference): A comprehensive reference to all of the HTML _elements_ and _attributes_.

### CSS ###

[Cascading Style Sheets (CSS)](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference) is a language for specifying how an HTML document should be presented (i.e. how it is displayed by the browser).  CSS uses _rules_ to apply styles to HTML _elements_. Each CSS rule _selects_ HTML elements to which it applies, specifies the _properties_ of the element that are to be styled (e.g. color, font-family, etc.) and gives a _value_ that indicates how they are to be styled (e.g. blue, cursive). [JavaScript](#javascript) can interact with CSS rules, properties, and values to dynamically change how (and if) HTML elements are displayed.

  - Resources:
    - [What is CSS?](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps/What_is_CSS): A (mostly) conceptual introduction to what CSS is and what it does.
    - [CSS Basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics): A great place to start if you have not worked with CSS before or want a refresher.
    - [Learn to style HTML using CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS): A collection of modules that give a comprehensive introduction to CSS.
    - [CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference): A comprehensive reference to all of the CSS _properties_ and _values_.

### JavaScript ###

[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference) is a programming language that can be used to add interactivity to HTML pages.  JavaScript can add or remove HTML elements, change CSS styles and respond to events (e.g. button clicks, text entry). JavaScript is also used to produce dynamic content by exchanging information with web services through Application Programming Interfaces (APIs). For example, when a user of FarmData2 saves or retrieves information about plantings or harvests it is done by JavaScript code using an API (see [FarmOS API](#farmos-api)).

  - Resources:
    - [JavaScript Basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics): A great place to start if you have not worked with JavaScript before or want a refresher.
    - [Strings](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Strings): An introduction to the way that strings are created and used in JavaScript.
    - [Arrays](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Arrays): An introduction to the way that arrays are created and used in JavaScript.
    - [JavaScript object basics](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics): An introduction to the way that objects are created and used in JavaScript.
    - [JavaScript - Dynamic client-side scripting](https://developer.mozilla.org/en-US/docs/Learn/JavaScript): A collection of modules that give a comprehensive introduction to JavaScript.
    - [JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference): A comprehensive reference to all of the JavaScript language features.

### Vue.js ###

[Vue.js](https://vuejs.org/) is a JavaScript framework for simplifying the creation of interactive web applications. Creating highly interactive applications using HTML, CSS and JavaScript is possible, but some of the details become repetitive and tedious. Vue.js simplifies many of the common operations by allowing parts of the displayed page to be _bound_ to a data object.  In that way, when JavaScript code changes the data object, the _view_ of that data displayed in the browser is automatically updated.

  - Resources:
    - [Vue.js Fundamentals](https://vueschool.io/courses/vuejs-fundamentals): A video-based course and a great place to start if you have not worked with Vue.js before or want a refresher. Click the "Start Course" button.
    - [Vue.js Guide](https://vuejs.org/v2/guide): A textual introduction to using Vue.js.
    - [Vue.js Components](https://vueschool.io/courses/vuejs-components-fundamentals): A video-based course that introduces the basics of Vue Components.
    - [Components Basics](https://vuejs.org/v2/guide/components.html): A textual introduction to Vue Components.
    - [FarmData2 Vue Component Details](https://github.com/DickinsonCollege/FarmData2/blob/main/farmdata2_modules/fd2_tabs/fd2_example/README.md): Information on specifically how FarmData2 uses and tests Vue Components.

### FarmOS API ###

The FarmData2 front-end exchanges data with the server using the [FarmOS V1 API](https://v1.farmos.org/development/api/). JavaScript code using the [Axios](https://github.com/axios/axios) library requests data from FarmOS (e.g. a list of fields) or sends new data to FarmOS (e.g. a new planting). When data is received from FarmOS, the Vue.js object is updated, which in turn updates what is displayed in the browser. Conversely, when the user enters data in the browser, that data updates the Vue.js object and that information is used to make requests to the server.

  - Resources:
    - [What is an API and how does it work?](https://www.youtube.com/watch?v=Yzx7ihtCGBs): A video introduction to APIs with a few examples. This is a good place to start if you are new to APIs.
    - [Using Axios to Consume APIs](https://vuejs.org/v2/cookbook/using-axios-to-consume-apis.html): A short example of a `GET` request using Axios and Vue.js.
    - [Axios](https://github.com/axios/axios): Full documentation for the Axios library. This shows how to do both `GET` and `POST` requests.
    - [FarmOS V1 API](https://v1.farmos.org/development/api/): Documentation for Version 1 of the FarmOS API.
    - [Hoppscotch](https://hoppscotch.io/): A tool for experimenting with API calls. This can be useful in figuring out how to request what you want from the FarmData2 API and how its responses are formatted.

### FarmData API ###

TODO: Write this and point to documentation.

### Bootstrap ###

[Bootstrap](https://getbootstrap.com/) is a framework and CSS component library used by farmOS, and thus by FarmData2, to provide stylized HTML components. Polished production FarmData2 modules will use Bootstrap components instead of basic HTML elements so that FarmData2 integrates visually into the farmOS interface.

  - Resources:
    - [Introduction to Bootstrap](https://getbootstrap.com/docs/5.0/getting-started/introduction/): Comprehensive documentation for the Bootstrap framework.

### Cypress ###

The functionality of FarmData2 is tested using the [Cypress framework](https://www.cypress.io/). The tests in FarmData2 consist of end-to-end tests and component tests.  The end-to-end tests run against the developer instance of FarmData2 and check the functionality of the pages.  The component tests check the behavior of custom components that appear in FarmData2, in isolation from the running instance. FarmData2 provides support for running both types of Cypress tests in a Docker container that eliminates the need to install or configure Cypress. See the documentation in the [farmdata2_modules/fd2_tabs/fd2_example/README.md](https://github.com/DickinsonCollege/FarmData2/blob/main/farmdata2_modules/fd2_tabs/fd2_example/README.md) file for information about running Cypress tests in FarmData2. 

#### End-to-End Tests ####

The Cypress end-to-end test framework works by controlling the web browser. A test typically consists of a series of steps that are automated by the Cypress tests, called _specs_. A typical spec consists of these steps:
  1. Setup the test (e.g. login, prime the database)
  1. Visit a specific page
  1. Query the page for an _HTML element_ of interest (e.g. button, ext field)
  1. Interact with that element (e.g. click the button, enter some text)
  1. Make an assertion about the result (e.g. new information appears on the page)

  - Resources
    - [Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html): As the docs say..."the single most important guide for understanding how to test with Cypress. Read it. Understand it."
    - [Writing Your First Test](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file): A good overview of how a typical Cypress test works, what the code looks like, and how to use the Cypress test runner.
    - [Selecting Elements](https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements): Best practices for selecting elements that are manipulated and checked by your tests. Following these will make your tests less brittle.
    - [Selector Playground](https://docs.cypress.io/guides/core-concepts/test-runner.html#Selector-Playground): A tool within the Cypress test runner that will help you find good selectors to use for the elements used in your tests.
    - [Interacting with Elements](https://docs.cypress.io/guides/core-concepts/interacting-with-elements): The main commands in Cypress for interacting with elements in the page (e.g. click, select, etc.).
    - [should](https://docs.cypress.io/api/commands/should.html#Syntax): Documentation for the `should` statement that is used to make assertions in Cypress tests.
    - [Assertions](https://docs.cypress.io/guides/references/assertions): A reference for all of the assertions (e.g. assertions and chainers for should) that can be used in Cypress tests.
    - [FarmData2 Cypress Tests Details](https://github.com/DickinsonCollege/FarmData2/blob/main/farmdata2_modules/fd2_tabs/fd2_example/README.md): Information on specifically how FarmData2 uses Cypress tests.

#### Component Tests ####

Cypress component tests work by mounting a Vue Component into a browser and allowing tests to interact with it in isolation from the application.  A typical component test will
  1. Configure and mount the component into the test framework.
  1. Query the component for an _HTML element_ of interest (e.g. button, ext field).
  1. Interact with that element (e.g. click the button, enter some text).
  1. Make an assertion about the result (e.g. the component emits an event or changes state).

  - Resources:
    - All of the Cypress resources above are also relevant here.
    - [Component Testing](https://docs.cypress.io/guides/component-testing/introduction): An introduction to the component testing in Cypress. Note: With FarmData2 support, you will not need to install or setup the component testing framework.
    - [Vue Test Utils Guides](https://vue-test-utils.vuejs.org/guides): Cypress component testing is built on top of the Vue Test Utils. So all of their functionality is also available within a Cypress component test. The _Getting Started_, _Common Tips_, _Testing Key, Mouse and other DOM Events_ and _Testing Asynchronous Behavior_ sections are most relevant to FarmData2 testing.
    - [Vue Test Utils API](https://vue-test-utils.vuejs.org/api/): API documentation for all of the functionality of the Vue Test Utils.
    - [FarmData2 Cypress Tests Details](https://github.com/DickinsonCollege/FarmData2/blob/main/farmdata2_modules/fd2_tabs/fd2_example/README.md): Information on specifically how FarmData2 uses Cypress tests.

## Project Automation ##

### docker ###

The developer install of FarmData2 relies on docker containers running
   - the core FarmData2 system including farmOS and Drupal.
   - an instance of MariaDB for data storage by farmOS and Drupal.
   - an instance of PHPmyAdmin to allow developers to interact directly with the MariaDB instance as necessary.
   - an instance of the TheiaIDE.
   - an instance of the Cypress testing environment.

All of the docker related configuration and source files are found in the [docker](https://github.com/DickinsonCollege/FarmData2/tree/main/docker) directory.

### docker-compose ###

FarmData2 uses docker-compose to build custom docker images for farmOS and the TheiaIDE containers and to start and network all of the containers.

See the `docker-compose.yml` file in the [docker](https://github.com/DickinsonCollege/FarmData2/tree/main/docker) directory.

### bash scripting ###

Bash scripts are provided in the [docker](https://github.com/DickinsonCollege/FarmData2/tree/main/docker) directory to simplify the process of bringing up and taking down FarmData2.

## Back-End Technologies ##

### farmOS ###

FarmData2 is built as a set of customizations to [farmOS](https://farmos.org/). The majority of FarmData2's features are added as custom modules displayed in tabs within the farmOS interface. See the [README.md](https://github.com/DickinsonCollege/FarmData2/blob/main/farmdata2_modules/fd2_tabs/fd2_example/README.md) in the `fd2_example` module for a description of how FarmData2 modules are added to farmOS.

### Express ###

TODO: Write this and add links.

### phpMyAdmin ###

TODO: Write this and add links.

### Drupal ###

farmOS runs on top of Drupal. From the FarmData2 perspective, this is largely transparent.  As it is discovered that more information is necessary, it will be added here.

### drush ###

For a few particular tasks related to initialization and configuration, FarmData2 makes use of [drush](https://www.drush.org/latest/) to interact with the Drupal instance on which farmOS is running. As it is discovered that more information is necessary, it will be added here.
