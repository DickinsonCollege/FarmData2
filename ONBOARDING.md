# On-Boarding to FarmData2 #

This document provides an overview of the technologies used in FarmData2.  It discusses the role that each technology plays in the project. Links are provided to further resources for learning about each technologies. These resource typically range from a quick introduction to definitive references. For some technologies, learning activities are provided that are specific to FarmData2 and focus on the essentials that are necessary to get started.

## Preliminaries ##

Before continuing, If you haven't already, please review the [README](README.md), the [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md), the [LICENSE](LICENSE.md) and the [CONTRIBUTING](CONTRIBUTING.md) documents as they provide information that is important to getting started and to maintaining the FarmData2 community.

## Tools ##

The following sections describe the key tools that are central to working with the FarmData2 project.

#### GitHub ####

The [FarmData2 project repository](https://github.com/DickinsonCollege/FarmData2) is stored on [GitHub](https://github.com/), and is likely where you found the code, and this file :smile:.  To work on FarmData2 you'll need to be comfotable interacting with GitHub.

  - Resources:
    - [Hello World](https://guides.github.com/activities/hello-world/): A first introduction to GitHub that will get you started if you haven't used it before.
    - [GitFlow Intro](https://guides.github.com/introduction/flow/): An introduction to an effective way of using GitHub (i.e. a _workflow_).
    - [GitFlow Details](https://githubflow.github.io/): A more detailed explanation of the GitFlow workflow.
    - [FarmData2 Workflow](CONTRIBUTING.md#workflow): An outline of the GitFlow steps as they are used for work on FarmData2.

#### git ####

FarmData2 uses [git](https://git-scm.com/) for version control and for implementing the parts of GitFlow that you do on your development machine (e.g. `branch`, `add`, `commit`, `push`, `pull`, `merge`).

  - Resources:
    - [7 Steps to Get Started with Git](https://www.fosslife.org/7-steps-get-started-git): An introduction to the essentials you need to know to work with an existing open source project.
    - [Git Immersion](https://gitimmersion.com/): A tutorial walks through a series of short hands-on exercises that provide practice with the key features of git.
    - [Pro Git Book](http://git-scm.com/book/en/v2) | [Learn Git Tutorial](https://www.tutorialspoint.com/git/index.htm): More detailed and comprehensive coverage of git's features and use.
    - [FarmData2 Workflow](CONTRIBUTING.md#workflow): An outline of the GitFlow steps as they are used for work on FarmData2.

#### Zulip ####

The FarmData2 community uses [Zulip](https://zulip.com/) as it communication platform. It is a group chat application that blends the benefits of asynchronous threaded discussions (e.g. a forum) with live chat.

You can connect with the [FarmData2 community](https://farmdata2.zulipchat.com/) on its Zulip site.

  - Resources:
    - [Streams and Topics](https://zulip.com/help/about-streams-and-topics): An introduction to the two key features of Zulip. Once you understand streams and topics Zulip is relatively easy to use.
    - [Zulip Home Page](https://zulip.com/): This page has a quick tour of Zulip's features that you can click through.
    - [User Documentation](https://zulip.com/help/): A comprehensive set of documentation on Zulip's use and features.

#### Editors ####

The code and documentation can be edited with any editor.  For convenience, the FarmData2 installation includes a browser-based integrated development environment (IDE) based on [Eclipse Theia](https://theia-ide.org/).

To access the Theia IDE once the [FarmData2 development environment is running](INSTALL#developer-install), just open a browser tab and go to:
```
http://localhost:3000
```
When the IDE opens:
  1. Click "Open Workspace"
  1. Select the `FarmDat2` directory
  1. Click "Open"

The explorer on the left will show the contents and structure of the FarmData2 repository. If you are familiar with other IDEs then using Theia should be relatively straight forward.

  - Resources:
    - [How to use Eclipse Theia as an IDE](https://eclipsesource.com/blogs/2019/10/04/how-to-use-eclipse-theia-as-an-ide/): An overview of Theia and its use ad an Integrated Development Enviornment.

If you have a favorite editor, you can of course use that as well. Note that as FarmDat2 matures utilities (e.g. linters and formatters) will be added to the provided Theia IDE. When such utilities are added to Theia they will be documented here so that you can install the appropriate plugins into your editor.

## Front-End Technologies ##

The majority of development for FarmDat2 is front-end (i.e. browser-based).  This section outlines the key technologies that are used for this development.

#### HTML ####

Hypertext Markup Language (HTML) is the base language that is used to create web pages. It defines the structure of a page and allows page _elements_ (e.g. headings, paragraphs, lists, images, etc.) to be tagged and labeled with _attributes_. The way that an element is tagged and labeled allows the browser (with [CSS](#css)) to determine how the content of the element should be displayed. Elements and attributes also allow [JavaScript](#javascript), [Vue.js](#vue.js) and [Cypress](#cypress) to interact with the page style, structure and content.

  - Resources:
    - [Getting started with HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/Getting_started): A great place to start if you have not worked with HTML before or want a refresher.
    - [Your first form](https://developer.mozilla.org/en-US/docs/Learn/Forms/Your_first_form): An introduction to HTML forms, which FarmData2 uses to collect input from the user (e.g. plantings, harvests, search critera, etc.)
    - [Introduction to HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML): A collection of guides and assessments that give a comprehensive introduction to HTML. Note: The two resources above are the key sub-sets of this resource for getting ready to work on FarmData2.
    - [HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference): A comprehensive reference to all of the HTML _elements_ and _attributes_.

#### CSS ####

#### JavaScript ####

#### Vue.js ####

#### Postman ####

#### FarmOS api ####

#### Axios ####

#### Cypress ####
 - principles?

## Automation ##

#### docker ####

#### docker-compose ####

#### bash scripting ####

## Back-End Technologies ##

#### Drupal ####

#### drush ####

#### farmOS ####
