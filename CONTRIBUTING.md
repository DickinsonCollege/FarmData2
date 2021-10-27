# Contributing to FarmData2 #

FarmData2 welcomes participation and contributions. There are many ways to contribute to FarmData2 that we hope will engage and energize a broad and diverse community. This document outlines a few of the ways to contribute.

## Code of Conduct ##

To promote an open, welcoming, inclusive and harassment-free experience, all engagement with FarmData2 is governed by the community standards expressed in the [Contributor Covenent](CODE_OF_CONDUCT.md).

## Licensing ##

Content in the FarmData2 project is released under several different licenses as described in the [LICENSE file](LICENSE.md). In addition, that file describes the rights and responsibilities of contributors with regard to the their contributed content. The licensing structure of FarmData2 is designed to ensure that FarmData2 remains free and open source while protecting both the project and it community of contributors. Please review it carefully before contributing content to FarmData2.

## Connecting ##

Connect with the [FarmData2 community on Zulip](https://farmdata2.zulipchat.com/).

If you are unfamiliar with [Zulip](https://zulip.com/) it is a group chat application that blends the benefits of threaded discussions with live chat. Zulip is relatively easy to use once you understand the key ideas of [streams and topics](https://zulip.com/help/about-streams-and-topics).

## Participation ##

There are many ways to participate in FarmData2. Some of them are listed below.  

Having a running version of FarmData2 is a prerequisite for many of the forms of participation.  The [Install Directions] give step by step instructions for getting FarmData2 up and running.

[Install Directions]: INSTALL.md

#### Bug Reports ####

If you are a user of FarmData2 and discover something that doesn't seem to be working correctly you can:

  * Reach out to the community on the [Zulip Developer Stream](https://farmdata2.zulipchat.com/#narrow/stream/271292-developers) to discuss what you have found and how to proceed.
  * Search the [Issue Tracker] to see if the bug has been reported already.
    * If it has, add a confirmed sighting or any additional information you have by commenting on the ticket.
    * If it has not, open a new ticket and give a description of the issue, identify the platform on which you are running FarmData2 and describe the steps someone can use to observe the bug.

[Issue Tracker]: https://github.com/DickinsonCollege/FarmData2/issues

#### Feature Requests ####

If you are are a user of FarmData2 and have a new feature you would like to see you can:

  * Reach out to the community on the [Zulip Developer Stream](https://farmdata2.zulipchat.com/#narrow/stream/271292-developers) to discuss the feature you'd like to see and how to proceed.
  * Search the [Issue Tracker] to see if the feature, or something close, has already been suggested by someone.
    * If it has, add a comment lending support and possibly refining or giving your perspective on the idea.
    * If it has not, open a new ticket and give a description of the new feature you would like to see.

#### Issue Gardening ####

The project [Issue Tracker] contains tickets describing known issues with the project.  The tickets for known issues are tagged with the label "bug".  Each reported bug will have a detailed description of how the bug can be observed. Gardening includes activities such as:

  * Verifying or clarifying these descriptions.
  * Enhance the report by providing additional information about the bug (e.g. platforms on which is is or is not seen).
  * Confirming that bug does (or does not) exist in the current version.

To participate by Gardening visit the [Issue Tracker] and find something of interest to verify, enhance or clarify.  Try it out in your running version of FarmData2 and add a comment to the ticket with what you find.

#### Documentation ####

Update to any of the FarmData2 documentation are welcome.  If you find typos, unclear or missing steps, poorly worded explanations, or have any other suggestions for how the documentation could be improved use the [workflow](#workflow) described below to create a pull request for your suggested changes.

#### Bug Fix / Feature Implementation ####

Tickets in the [Issue Tracker] that are tagged _bug_ or _enhancement_ describe issues be fixed or new features to be added to FarmData2. The tag _good first issue_ appears on the most approachable tickets.  If you find an issue to work on use the [workflow](#workflow) described below to create a pull request for your suggested bug fix or feature implementation. Information about the languages and technologies that are used in FarmdData2 and pointers to resources for learning more about them can be found in the [Technology On-boarding](#technology-on-boarding) section below.

#### Other Thoughts ####

The above is not an exhaustive list of ways to participate in FarmData2. For some other ideas check out [50 Ways to be a FOSSer](http://foss2serve.org/index.php/50_Ways_to_be_a_FOSSer). If anything there seems interesting or if you have other ideas of your own please get in touch and we will be happy to have a discussion about how you might get involved.

## Technology Onboarding ##

Interacting with FarmData2 requires a basic familiarity with git and GitHub. FarmData2 development uses a fairly standard web technology stack including HTML, CSS, Bootstrap, JavaScript, and Vue.js. The front-end accesses FarmData2 data through the [FarmOS API](https://farmos.org/development/api/) using the [Axios](https://github.com/axios/axios) library. End-to-end and component testing is done using the [Cypress framework](https://www.cypress.io/).

If you are unfamiliar with one or more of these technologies the [ONBOARDING](ONBOARDING.md) document provides additional information about each, as well as resources and activities for learning about them.

## Workflow ##

FarmData2 generally uses the [GitHub flow](https://guides.github.com/introduction/flow/) branching workflow and accepts contributions via Pull Requests. If you are new to git based branching workflows you may find this [in depth description GitHub flow](https://githubflow.github.io/) helpful.

As a reference, the basic steps for working with GitHub Flow are as follows:

  * Go to the [FarmData2 Repository] (the _upstream_)
  * Fork the _upstream_ repository to your GitHub (the _origin_).
  * [Clone] the _origin_ repository to your local machine.
  * Set the  _upstream_ remote for your local repository to point to the _upstream_ repository.
  * Create a _feature branch_ from the _main_ branch your local machine.
  * Make the edits to the documentation or the code in your _feature branch_.
  * Commit your edits.
    * If the contribution reflects the work of multiple people, ensure that everyone receives attribution by [Creating a commit with multiple authors].
  * Pull the most recent _upstream_ version of the _main branch_.
  * Merge the updated _main branch_ into your _feature branch_.
  * Push your _feature branch_ to the _origin_.
  * Make a Pull Request for your _feature branch_ to the _upstream_.  

[Clone]: https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository
[FarmData2 Repository]: https://github.com/DickinsonCollege/FarmData2
[Creating a commit with multiple authors]: https://docs.github.com/en/free-pro-team@latest/github/committing-changes-to-your-project/creating-a-commit-with-multiple-authors
