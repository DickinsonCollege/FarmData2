# On-Boarding to FarmData2 #

This document provides an overview of the technologies used in FarmData2.  It discusses the role that each technology plays in the project. Links are provided to further resources for learning about each technologies. For some technologies, learning activities are provided that are specific to FarmData2 and focus on the essentials necessary to get started.

## Preliminaries ##

Before continuing, If you haven't already, please review the [README](README.md), the [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md), the [LICENSE](LICENSE.md) and the [CONTRIBUTING](CONTRIBUTING.md) documents as they provide information that is important to getting started and to maintaining the FarmData2 community.

## Tools ##

There are a few key tools that are central to working with the FarmData2 project

#### GitHub ####

The [FarmData2 project repository](https://github.com/DickinsonCollege/FarmData2) is stored on [GitHub](https://github.com/), and is likely where you found the code, and this file :smile:.

If you are not familiar with GitHub they have a [Hello World](https://guides.github.com/activities/hello-world/) introduction that will get you started.  After that you'll want to be sure you are familiar with the _GitFlow branching workflow_ [[Intro](https://guides.github.com/introduction/flow/) | [Details](https://githubflow.github.io/)]. An outline of GitFlow steps as it is used in FarmData2 can be found in the [CONTRIBUTING](CONTRIBUTING.md#workflow) document.

#### git ####

FarmData2 uses [git](https://git-scm.com/) for version control and for implementing the parts of GitFlow that you do on your development machine (e.g. `branch`, `add`, `commit`, `push`, `pull`, `merge`). If you are not yet familiar with git, the [7 Steps to Get Started with Git](https://www.fosslife.org/7-steps-get-started-git) covers the essentials you need to know work with an existing open source project.  The [Git Immersion](https://gitimmersion.com/) tutorial walks through a series of short hands-on exercises that will give you practice with the key features of git. The [Pro Git Book](http://git-scm.com/book/en/v2) or the [Learn Git Tutorial](https://www.tutorialspoint.com/git/index.htm) provided more detailed and comprehensive coverage. An outline of the use of git (within GitFlow) as it is used in FarmData2 can be found in the [CONTRIBUTING](CONTRIBUTING.md#workflow) document.

#### Zulip ####

The FarmData2 community uses [Zulip](https://zulip.com/) as it communication platform. It is a group chat application that blends the benefits of asynchronous threaded discussions (e.g. a forum) with live chat. Zulip is relatively easy to use once you understand the key ideas of [streams and topics](https://zulip.com/help/about-streams-and-topics).  The [Zulip Home Page](https://zulip.com/) has a quick tour of the features that you can click through and there is also a full set of [User Documentation](https://zulip.com/help/).

Be sure to connect with the [FarmData2 community](https://farmdata2.zulipchat.com/) on its Zulip site.

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

The explorer on the left will show the contents and structure of the FarmData2 repository. If you are familiar with other IDEs using Theia should be relatively straight forward. You can consult the [How to use Eclipse Theia as an IDE](https://eclipsesource.com/blogs/2019/10/04/how-to-use-eclipse-theia-as-an-ide/) article for more information on using Theia.

If you have a favorite editor, you can of course use that as well. Note that as FarmDat2 matures utilities (e.g. linters and formatters) will be pre-configured in the provided Theia IDE. When such utilities are added they will be described here so that you can install the appropriate plugins into your editor.

## Front-End Technologies ##

#### HTML ####

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
