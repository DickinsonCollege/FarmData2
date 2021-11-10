# Onboarding to FarmData2 #

This document provides an overview of the technologies used in FarmData2, describes the roles that they play and provides resources for learning the essentials of each.

Interacting with FarmData2 requires a basic familiarity with git and GitHub. FarmData2 development uses a fairly standard web technology stack including HTML, CSS, Bootstrap, JavaScript, and Vue.js. The front-end accesses FarmData2 data through the [FarmOS API](https://farmos.org/development/api/) using the [Axios](https://github.com/axios/axios) library. End-to-end testing is done using the [Cypress framework](https://www.cypress.io/). The automation, configuration and back-end development of FarmData2 use a number of other technologies including Drupal, drush, FarmOS, Docker, docker-compose and bash scripting.

This document is intended to be used in two ways. When you are new to FarmData2, it is recommended that you work through this document from the top down. However, it is not essential that you fully master every tool and technology on the first pass. Rather once you feel basically comfortable with a tool or technology (or if you already know it) skip to the next one.  Then later, while working on FarmData2 you can return to this document and jump directly to the relevant section(s) to find a reference or to learn a little bit more as needed.

## Preliminaries ##

Before continuing, If you haven't already, please review the [README](README.md), the [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md), the [LICENSE](LICENSE.md) and the [CONTRIBUTING](CONTRIBUTING.md) documents as they provide information that is important to getting started and to maintaining the FarmData2 community.

## Communications ##  

The FarmData2 community uses [Zulip](https://zulip.com/) as its communication platform. Zulip is a group chat application that blends the benefits of asynchronous threaded discussions (e.g. a forum) with live chat.

Connecting with the [FarmData2 community](https://farmdata2.zulipchat.com/) on Zulip provides a place to ask questions of the project managers and the broader developer community.

  - Resources:
    - [Streams and Topics](https://zulip.com/help/about-streams-and-topics): An introduction to the two key features of Zulip. Once you understand streams and topics Zulip is relatively easy to use.
    - [Zulip Home Page](https://zulip.com/): This page has a quick tour of Zulip's features that you can click through.
    - [User Documentation](https://zulip.com/help/): A comprehensive set of documentation on Zulip's use and features.

## Prerequisites ##

The FarmData2 documentation and resources assume a basic facility with git, GitHub and a familiarity with the GitFlow branching workflow. You'll need to understand the steps outlined in the [FarmData2 Workflow](CONTRIBUTING.md#workflow).

The following resources can be useful for learning what you'll need to know about git and GitHub:

  - Resources:
    - [Hello World](https://guides.github.com/activities/hello-world/): A first introduction to GitHub that will get you started if you haven't used it before.
    - [GitFlow Intro](https://guides.github.com/introduction/flow/): An introduction to an effective way of using GitHub (i.e. a _workflow_).  The following two guides walk through how to work with existing open source projects and essentially follow GitFlow:
      - [Step-by-step guide to contributing on GitHub](https://www.dataschool.io/how-to-contribute-on-github/)
      - [7 Steps to Get Started with Git](https://www.fosslife.org/7-steps-get-started-git).
    - [Git Immersion](https://gitimmersion.com/): A tutorial that walks through a series of short hands-on exercises that provide practice with the key features of git.
    - [Pro Git Book](http://git-scm.com/book/en/v2) | [Learn Git Tutorial](https://www.tutorialspoint.com/git/index.htm): More detailed and comprehensive coverage of git's features and use.

## Quickest Start ##

FarmData2 makes use of the following key technologies. HTML, CSS and Bootstrap, JavaScript with Vue.js and Axios, and Cypress for testing. If you are familiar all or most of those it may be sufficient to start by having a look at any of the modules in [farmdata2_modules/fd2_tabs](https://github.com/DickinsonCollege/FarmData2/tree/main/farmdata2_modules/fd2_tabs). The [fd2_example/README.md](https://github.com/DickinsonCollege/FarmData2/blob/main/farmdata2_modules/fd2_tabs/fd2_example/README.md) provides the essential information about how to add and test new FarmData2 features.

## FarmData2 School ##

FarmData2 has been used in a number of undergraduate computer science courses and activities have been developed to guide students through an introduction to FarmData2 and the technologies that it uses.  If you are new to open source and FarmData2 or to any of the technologies that FarmData2 uses, working through these activities will be an efficient way to get up to speed. If you are a more experienced developer you might just pick and choose from these activities, or skip over them completely to the more general resources in the sections below.

The activities will guide you from an introduction to FOSS and FarmData2, through installation of FarmData2 and then through the use of each of the key technologies used in FarmData2. Each activity includes practice using the technologies within the context of FarmData2. Thus, you'll learn not only the technologies, but will get comfortable working within the FarmData2 developer environment as well.

If you use these activities, please keep in mind that they were created for use as assignments in courses. Thus, you shouldn't feel obligated to answer every question and you should skip over any class specific parts that don't make sense outside of a course. When you have completed all of the activities you'll be well on your way to being a FarmData2 developer.  In addition, while these activites will be updated as FarmData2 evolves, they may not be fully in synch with the latest code in the repository.  If you run in to any issues, use the 

- 01 - Introduction to FOSS & The FarmData2 Community [ [docx](media/Activities/01-IntroToFarmData2.docx) | [pdf](media/Activities/01-IntroToFarmData2.pdf) ]
- 02 - FarmData2 Developer Install [ [docx](media/Activities/02-DeveloperInstall.docx) | [pdf](media/Activities/02-DeveloperInstall.pdf) ]
- 03 - HTML Technology Spike [ [docx](media/Activities/03-HTMLSpike.docx) | [pdf](media/Activities/03-HTMLSpike.pdf) ]
- 04 - Vue Data Binding Technology Spike [ [docx](media/Activities/04-VueDataBindingSpike.docx) | [pdf](media/Activities/04-VueDataBindingSpike.pdf) ]
- 05 - Vue Events and JavaScript Functions Technology Spike [ [docx](media/Activities/05-VueJSEventsSpike.docx) | [pdf](media/Activities/05-VueJSEventsSpike.pdf) ]
- 06 - Web APIs Technology Spike [ [docx](media/Activities/06-WebAPIsSpike.docx) | [pdf](media/Activities/06-WebAPIsSpike.pdf) ]
- 07 - FarmOS API Technology Spike [ [docx](media/Activities/07-FarmOSAPISpike.docx) | [pdf](media/Activities/07-FarmOSAPISpike.pdf) ]
- 08 - Cascading Style Sheets and Bootstrap (in development)
- 09 - Element Selectors and Cypress Testing (in development)

## Additional Resources ##

### Installation ###

The [INSTALL.md](INSTALL.md) file contains the instructions for doing a [Developer Install](INSTALL.md#developer-install). After you complete the developer install FarmData2 will be setup and ready for you to work on.

### Editors ###

The FarmData2 code and documentation can be edited with any editor.  However, for convenience, the FarmData2 installation includes a browser-based integrated development environment (IDE) based on [Eclipse Theia](https://theia-ide.org/).

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
    - [How to use Eclipse Theia as an IDE](https://eclipsesource.com/blogs/2019/10/04/how-to-use-eclipse-theia-as-an-ide/): An overview of Theia and its use as an Integrated Development Environment.

As FarmData2 matures, utilities (e.g. linters and formatters) will be added to the provided Theia IDE. If you choose to use a different editor, all such utilities will be documented in the [INSTALL.md](INSTALL.md) file so that you can install the appropriate plugins for your editor.

### Front-End Technologies ###

The majority of development for FarmData2 is front-end (i.e. browser-based).  This section outlines the key technologies that are used for this development.

#### HTML ####

[Hypertext Markup Language (HTML)](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference) is the base language that is used to create web pages. It defines the structure of a page and allows page _elements_ (e.g. headings, paragraphs, lists, images, etc.) to be _tagged_ and labeled with _attributes_. The way that an element is tagged and labeled allows the browser (with [CSS](#css)) to determine how the content of the element should be displayed. Elements and attributes also allow [JavaScript](#javascript), [Vue.js](#vue.js) and [Cypress](#cypress) to interact with the page style, structure and content.

  - Resources:
    - [HTML Basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics): A great place to start if you have not worked with HTML before or want a refresher.
    - [Your first form](https://developer.mozilla.org/en-US/docs/Learn/Forms/Your_first_form): An introduction to HTML forms, which FarmData2 uses to collect input from the user (e.g. plantings, harvests, search criteria, etc.)
    - [HTML Tables](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables): An introduction to creating tables in HTML, which FarmData2 uses to display many of the different reports that can be generated.
    - [Introduction to HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML): A collection of guides and assessments that give a comprehensive introduction to HTML.
    - [HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference): A comprehensive reference to all of the HTML _elements_ and _attributes_.

#### CSS ####

[Cascading Style Sheets (CSS)](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference) is a language for specifying how an HTML document should be presented (i.e. how it is displayed by the browser).  CSS uses _rules_ to apply styles to HTML _elements_. Each CSS rule _selects_ HTML elements to which it applies, specifies the _properties_ of the element that are to be styled (e.g. color, font-family, etc.) and gives a _value_ that indicates how they are to be styled (e.g. blue, cursive). [JavaScript](#javascript) can interact with CSS rules, properties and values to dynamically change how (and if) HTML elements are displayed.

  - Resources:
    - [What is CSS?](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps/What_is_CSS): A (mostly) conceptual introduction to what CSS is and what it does.
    - [CSS Basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics): A great place to start if you have not worked with CSS before or want a refresher.
    - [Learn to style HTML using CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS): A collection of modules that give a comprehensive introduction to CSS.
    - [CSS reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference): A comprehensive reference to all of the CSS _properties_ and _values_.

#### JavaScript ####

[JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference) is a programming language that can be used to add interactivity to HTML pages.  JavaScript can add or remove HTML elements, change CSS styles and respond to events (e.g. button clicks, text entry). JavaScript is also used to produce dynamic content by exchanging information with web services through Application Programming Interfaces (APIs). For example, when a user of FarmData2 saves or retrieves information about plantings or harvests it is done by JavaScript code using an API (see [FarmOS API](#farmos-api)).

  - Resources:
    - [JavaScript Basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics): A great place to start if you have not worked with JavaScript before or want a refresher.
    - [Strings](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Strings): An introduction to the way that strings are created and used in JavaScript.
    - [Arrays](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Arrays): An introduction to the way that arrays are created and used in JavaScript.
    - [JavaScript object basics](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Basics): An introduction to the way that objects are created and used in JavaScript.
    - [JavaScript - Dynamic client-side scripting](https://developer.mozilla.org/en-US/docs/Learn/JavaScript): A collection of modules that give a comprehensive introduction to JavaScript.
    - [JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference): A comprehensive reference to all of the JavaScript language features.

#### Vue.js ####

[Vue.js](https://vuejs.org/) is a JavaScript framework for simplifying the creation of interactive web applications. Creating highly interactive applications using HTML, CSS and JavaScript is possible, but some of the details become repetitive and tedious. Vue.js simplifies many of the common operations by allowing parts of the displayed page to be _bound_ to a data object.  In that way, when JavaScript code changes the data object the _view_ of that data displayed in the browser is automatically updated.

  - Resources:
    - [Vue.js Fundamentals](https://vueschool.io/courses/vuejs-fundamentals): A video based course and a great place to start if you have not worked with Vue.js before or want a refresher. Click the "Start Course" button.
    - [Vue.js Guide](https://vuejs.org/v2/guide): A textual introduction to using Vue.js.
    - [Vue.js Components](https://vueschool.io/courses/vuejs-components-fundamentals): A video based course that introduces the basics of Vue Components.
    - [Components Basics](https://github.com/DickinsonCollege/FarmData2/edit/main/ONBOARDING.md): A textual introduction to Vue Components.
    - [FarmData2 Vue Component Details](https://github.com/DickinsonCollege/FarmData2/blob/main/farmdata2_modules/fd2_tabs/fd2_example/README.md): Information on specifically how FarmData2 uses and tests Vue Components.

#### FarmOS API ####

The FarmData2 front end exchanges data with the server using the [FarmOS API](https://farmos.org/development/api/). JavaScript code using the [Axios](https://github.com/axios/axios) library requests data from FarmOS (e.g. a list of fields) or sends new data to FarmOS (e.g. a new planting). When data is received from FarmOS, the Vue.js object is updated, which in turn updates what is displayed in the browser. Conversely, when the user enters data in the browser, that data updates the Vue.js object and that information is used to make requests to the server.

  - Resources:
    - [What is an API and how does it work?](https://www.youtube.com/watch?v=Yzx7ihtCGBs): A video introduction to APIs with a few examples.This is a good place to start if you are new to APIs.
    - [Using Axios to Consume APIs](https://vuejs.org/v2/cookbook/using-axios-to-consume-apis.html): A short example of a `GET` request using Axios and Vue.js.
    - [Axios](https://github.com/axios/axios): Full documentation for the axios library. This show how to do both `GET` and `POST` requests.
    - [FarmOS API](https://farmos.org/development/api/): Documentation for the FarmOS API.
    - [Hoppscotch](https://hoppscotch.io/): A tool for experimenting with API calls. This can be useful in figuring out how to request what you want from the FarmData2 API and how its responses are formatted.

#### Bootstrap ####

[Bootstrap](https://getbootstrap.com/) is a framework and CSS component library used by farmOS, and thus by FarmData2, to provide stylized HTML components. Polished production FarmData2 modules will use Bootstrap components instead of basic html elements so that FarmData2 integrates visually into the farmOS interface.

  - Resources:
    - [Introduction to Bootstrap](https://getbootstrap.com/docs/5.0/getting-started/introduction/): Comprehensive documentation for the Bootstrap framework.

#### Cypress ####

The functionality of FarmData2 is tested using the [Cypress framework](https://www.cypress.io/). The tests in FarmData2 consist of end-to-end tests and component tests.  The end-to-end tests run against the developer instance of FarmData2 and check the functionality of the pages.  The component tests check the behavior of custom components that appear in FarmData2, in isolation from the runing instance. FarmData 2 provides support for running both types of Cypress tests in a Docker container that eliminates the need to install or configure Cypress. See the documentation in the [farmdata2_modules/fd2_tabs/README.md](https://github.com/DickinsonCollege/FarmData2/blob/main/farmdata2_modules/fd2_tabs/fd2_example/README.md) file for information about runing Cypress tests in FarmData2. 

##### End-to-End Tests #####

The Cypress end-to-end test framework works by controlling the web browser. A test typically consists of a series of steps that are automated by the Cypress tests, called *spec*s. A typical spec consist of the steps:
  1. Setup the test (e.g. login, prime the database)
  1. Visit a specific page
  1. Query the page for an _html element_ of interest (e.g. button,text field)
  1. Interact with that element (e.g. click the button, enter some text)
  1. Make an assertion about the result (e.g. new information appears on the page)

  - Resources
    - [Introduction to Cypress](https://docs.cypress.io/guides/core-concepts/introduction-to-cypress.html): As the docs say... "the single most important guide for understanding how to test with Cypress. Read it. Understand it."
    - [Writing Your First Test](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file): A good overview of how a typical cypres test work, what the code looks like and how to use the cypress test runner.
    - [Selecting Elements](https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements): Best practices for selecting elements that are manipulated and checked by your tests. Following these will make your tests less brittle.
    - [Selector Playground](https://docs.cypress.io/guides/core-concepts/test-runner.html#Selector-Playground): A tool within the cypress test runner that will help you find good selectors to use for the elements used in your tests.
    - [Interacting with Elements](https://docs.cypress.io/guides/core-concepts/interacting-with-elements): The main commands in cypress for interacting with elements in the page (e.g. click, select, etc.)
    - [should](https://docs.cypress.io/api/commands/should.html#Syntax): Documentation for the `should` statement that is used to make assertions in cypress tests.
    - [Assertions](https://docs.cypress.io/guides/references/assertions): A reference for all of the assertions (e.g. assertions and chainers for should) that can be used in cypress tests.
    - [FarmData2 Cypress Tests Details](https://github.com/DickinsonCollege/FarmData2/blob/main/farmdata2_modules/fd2_tabs/fd2_example/README.md): Information on specifically how FarmData2 uses Cypress tests.
##### Component Tests #####

Cypress component tests work by mounting a Vue Component into a browser and allowing tests to interact with it in isolation from the application.  A typical component test will:
  1. Configuring and mounting the component into the test framework.
  1. Query the component for an _html element_ of interest (e.g. button, ext field)
  1. Interact with that element (e.g. click the button, enter some text)
  1. Make an assertion about the result (e.g. the component emits an event or changes state).

  - Resources:
    - All of the Cypress resources above are also relevant here.
    - [Component Testing](https://docs.cypress.io/guides/component-testing/introduction): An introduction to the component testing in Cypress. Note: With FarmData2 support you will not need to install or setup the component testing framework.
    - [Vue Test Utils Guides](https://vue-test-utils.vuejs.org/guides): Cypress component testing is built on top of the Vue Test Utils. So all of their functionality is also available within a Cypress component test. The _Getting Started_, _Common Tips_, _Testing Key, Mouse and other DOM Events_ and _Testing Asynchronous Behavior_ sections are most relevant to FarmData2 testing.
    - [Vue Test Utils API](https://vue-test-utils.vuejs.org/api/): API documentation for all of the functionality of the Vue Test Utils.
    - [FarmData2 Cypress Tests Details](https://github.com/DickinsonCollege/FarmData2/blob/main/farmdata2_modules/fd2_tabs/fd2_example/README.md): Information on specifically how FarmData2 uses Cypress tests.

### Project Automation ###

#### docker ####

The developer install of FarmData2 relies on docker containers running:
   - the core FarmData2 system including farmOS and Drupal.
   - an instance of MariaDB for data storage by farmOS and Drupal.
   - an instance of PHPmyAdmin to allow developers to interact directly with the MariaDB instance as necessary.
   - an instance of the TheiaIDE.
   - an instance of the Cypress testing environment.

All of the docker related configuration and source files are found in the [docker](https://github.com/DickinsonCollege/FarmData2/tree/main/docker) directory.

#### docker-compose ####

FarmData2 uses docker-compose to build custom docker images for farmOS and the TheiaIDE containers and to start and network all of the containers.

See the `docker-compose.yml` file in the [docker](https://github.com/DickinsonCollege/FarmData2/tree/main/docker) directory.

#### bash scripting ####

Bash scripts are provided in the [docker](https://github.com/DickinsonCollege/FarmData2/tree/main/docker) directory to simplify the process of bringing up and taking down FarmData2.

### Back-End Technologies ###

#### farmOS ####

FarmData2 is built as a set of customizations to [farmOS](https://farmos.org/). The majority of FarmData2's features are added as custom modules displayed in tabs within the farmOS interface. See the [README.md](https://github.com/DickinsonCollege/FarmData2/blob/main/farmdata2_modules/fd2_tabs/fd2_example/README.md) in the `fd2_example` module for a description of how FarmData2 modules are added to farmOS.

#### Drupal ####

farmOS runs on top of Drupal. From the FarmData2 perspective this is largely transparent.  As it is discovered that more information is necessary it will be added here.

#### drush ####

For a few particular tasks related to initializtion and configuration FarmData2 makes use of [drush](https://www.drush.org/latest/) to interact with the Drupal instance on which farmOS is running. As it is discovered that more information is necessary it will be added here.
