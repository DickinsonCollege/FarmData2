# Contributing to FarmData2 #

This document provides a step-by-step guide to fixing your first issue in FarmData2. While this guide is targeted at making a first contribution, the process it outlines is general and will apply to all code or documentation contributions. So you may find it helpful to return here if you continue to contribute. For ways to contribute other than fixing issues, see the [Other Ways to Contribute Document](docs/WaysToContribute.md).

## 1. Review FarmData2's Code of Conduct ##

FarmData2 is committed to creating an open, welcoming, inclusive, and harassment-free experience for all community members. Please review the Code of Conduct before engaging with the FarmData2 community.

- [FarmData2 Code of Conduct](CODE_OF_CONDUCT.md)

## 2. Review the FarmData2's Licensing ##

We use a variety of licenses and agreements to ensure that FarmData2 remains free and open source while protecting both the project and its community of contributors. Please review the Licensing information below before contributing to the FarmData2 project.

- [FarmData2 Licensing](LICENSE.md)

## 3. Install and Run FarmData2 ##

Ensure that FarmData2 has been installed and is running. The following steps will assume that you are working within the FarmData2 development environment via a VNC Viewer or via noVNC in a browser.

- [Installing FarmData2](INSTALL.md)

## 4. Connect with the FarmData2 Community ##

The FarmData2 community communicates via Zulip as its primary location for reaching out with questions or for additional information.

  1. Visit the [FarmData2 community on Zulip](https://farmdata2.zulipchat.com/)
  2. Log in to Zulip using an existing Google, GitHub or GitLab account, or "Sign Up" using your e-mail.
  3. Say "Hello!" and tell us a little about yourself in the [Introduce Yourself Stream](https://farmdata2.zulipchat.com/#narrow/stream/270883-general/topic/Introduce.20Yourself).

The [Getting Started with Zulip Page] from the [Zulip Help Center](https://zulip.com/help/) provides a quick introduction to using Zulip if you want a few pointers.

## 5. Find an Issue to Work On ##

Visit the Issue Tracker to find an issue on which to work:

- [FarmData2 Issue Tracker](https://github.com/DickinsonCollege/FarmData2/issues)

In particular, you can search the Issue Tracker for tickets with the following labels that indicate that the issue is a good place to get started:

- [![Good First Issue](media/GoodFirstIssueLabel.jpg)](https://github.com/DickinsonCollege/FarmData2/labels/good%20first%20issue) - The issues described in these tickets are the most approachable and do not require an in depth knowledge of the project or its technologies. They typically involve changes that do not affect the application's behavior. Often a familiarity with Markdown, HTML, and/or JavaScript is sufficient for addressing these issues. These issues provide a great way to get familiar with the process of making a contribution. 

- [![Good Second Issue](media/GoodSecondIssueLabel.jpg)](https://github.com/DickinsonCollege/FarmData2/labels/Good%20Second%20Issue) - The issues described in these tickets require some local understanding that is typically limited to one or two source files. They will usually require changes that affect behavior and thus may also require creation or modification of unit or end-to-end tests. Thus, greater familiarity with Javascript, Vue.js, and/or Cypress tests may be required. These issues provide a great way to dig a little deeper, though still without requiring too deep a dive into the project.

## 6. Comment on the Ticket to Claim it ##

When you find an issue that you would like to work on, make a comment on the ticket expressing your interest. Something like the following is sufficient:

  ```
  I would like to work on this isssue!
  ```

One of the project maintainers will then assign the ticket to you.  

If you decide not to continue working on that issue, make another comment on the ticket letting us know so that we can assign it to someone else.

## 7. Synchronize with the Upstream Repository ##

Before beginning to address an issue you should *synchronize* your local repository and your `origin` repository (i.e. your fork on GitHub) with the `upstream` FarmData2 repository. This ensures that you begin your changes with the most up to date code and documentation.

Use the following commands in a Terminal window to synchronize your local repository and your `origin` repository with the `upstream`:

  ```
  cd FarmData2
  git pull --ff-only upstream main
  git push origin main
  ```

  Note: If you cloned your FarmData2 repository somewhere other than a `FarmData2` directory in the home directory you'll need to adjust the `cd` command above. All future sections of this document assume that the directory containing your FarmData2 repository is the current working directory.

If you encounter any problems, review the instructions for [Installing FarmData2](INSTALL.md) and then reach out to the [FarmData2 community on Zulip](https://farmdata2.zulipchat.com/).

## 8. Create and Switch to a Feature Branch ##

All of the changes that you make to address an issue should be contained in a *feature branch*.

Use the following commands to create and switch to a feature branch. Be sure to replace the text `MyFeatureBranch` with a descriptive name based on the issue you are working on.

  ```
  git branch MyFeatureBranch
  git switch MyFeatureBranch
  git status
  ```
 
The output of the `git status` command should confirm that you have created and switched to your new feature branch.

If you encounter any problems with this step, or any of the following ones, be sure to reach out to the [FarmData2 community on Zulip](https://farmdata2.zulipchat.com/).
  
## 9. Solve the Issue ##

Open the *VSCodium IDE* (or another editor of your choice) and modify the contents of the files in your local FarmData2 repository to address the issue. If your work requires multiple changes you should iterate between this step and and the following step until the issue is addressed.

## 10. Add and Commit Your Fix to your Local Repo ##

Each time you make changes that represent a *nameable unit of work* commit them to your local FarmData2 repository with a commit message that describes what has been done. For example, if you made a change that added a link to the farmOS project to the `README.md` file you would use the following commands:

  ```
  git status
  git add README.md
  git commit -m "Linked to the farmOS project"
  git log
  ```

If you have worked on your changes with someone else you will need to be sure to get them credit too by making a *co-authored commit* as follows:
  ```
  git commit -m "Refactor usability tests.
  > 
  >
  Co-authored-by: NAME <NAME@EXAMPLE.COM>
  Co-authored-by: AUTHOR-NAME <ANOTHER-NAME@EXAMPLE.COM>"
  ```
  You'll need to know your co-author(s) e-mail address or GitHub *no-reply email* so that you can provide it in the commit message. Note: The `>` characters appear when you press *Enter* or *Return* in the Terminal because the string that is opened (`"`) after the `-m` is not terminated (`"`) until after the final co-author line.

Inspect the output of the `git status` command to confirm that your are in the right place and the `git log` command to confirm that you have successfully committed your changes.

## 11. Push your Feature Branch to your Origin Repo ##

When you have fully addressed the issue you are working on, you will `push` your feature branch to your `origin` repository on GitHub. Pushing your changes to GitHub will allow you to make a Pull Request (below) that will invite the FarmData2 maintainers to see and review your work.  

Use the following commands to push your feature branch to your `origin` on GitHub. Be sure to replace `MyFeatureBranch` with the name of the branch that you created above.

   ```
   git status
   git push origin MyFeatureBranch
   git status
   ```
   
Inspect the output of the `git status` commands to confirm that your are in the right place and that you have successfully pushed your feature branch.

## 12. Make a Pull Request ##

You'll now make a pull request to let the FarmData2 maintainers know that you have some changes that address the issue on which you were working. Use the following steps to create your pull request:

  1. Visit your `origin` repository on GitHub. 
  2. Click the green "Compare and Pull Request" button at the top of the page.
     - If you do not see this button then see if GitHub's instructions for [Creating a pull request from a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) will help. If you follow these directions the `base branch` should be the `main` branch of the `upstream` FarmData2 repo. The `compare branch` should be your feature branch in your `origin` repository.
  3. Write a title for your pull request that describes what it does.
  4. Fill in a more complete description of your pull request in body.
       - At a minimum you should include a line that indicates the issue that has been addressed by your changes. For example, if your changes address ticket #123 in the issue tracker then add the line:
         ```
         Closes #123
         ```
         Including this line ensures that the ticket in the issue tracker will be automatically closed if your changes are accepted. 
  5. Click the "Create Pull Request" button.  
     - If your work is not complete, but you want to get feedback from the maintainers choose the "Create Draft Pull Request" option.

## 13. Follow Up ##

Once you submit a pull request you should keep an eye out for a reply from the project maintainer. This reply might:
  - Congratulate you on your pull request being merged.
  - Provide a request for further changes before your request can be merged.
  - Ask questions about your approach or implementation.
  - Etc.

Prompt responses to the maintainers are always appreciated and improve the chances that your pull request (possibly with revision) will be merged.

## 14. Update your Pull Request as Necessary ##

If you received feedback on your pull request and changes were requested, you can update your pull request as follows:
  1. Make the requested changes in your local repository.
  2. Commit the changes to your feature branch.
  3. Push your feature branch to your `origin` repository on GitHub.

When you commit and push changes to a feature branch for which a pull request has been created, the pushed changes are automatically a part of the pull request. There is no need to create a new pull request.

## 15. Delete Your Feature Branch ##

When your pull request is merged, or is closed without being merged, you can delete your feature branch.  

The following commands will delete your feature branch from your local repository:

  ```
  git branch
  git branch -D MyFeatureBranch
  git branch
  ```

Use the output of the `git branch` commands to confirm that your feature branch has been deleted.

You can delete your feature branch from your `origin` on GitHub using the web interface through your browser, or you can use the following command:

  ```
  git push origin --delete MyFeatureBranch
  ```

You can use the web interface through your browser to confirm that the branch has been deleted from GitHub.

## 16. Contribute More ##

Now that you've made your first contribution, if you are ready for more you can:
  - Head back to step #5 of this document and start again! If you get into working on more complex issues and need to learn more about the FarmData2 project or the technologies that it uses, be sure to:
    - Check out the other [ways to contribute to FarmData2](docs/WaysToContribute.md).
    - Check out the [RESOURCES page](RESOURCES.md).
    - Reach out to the [FarmData2 community on Zulip](https://farmdata2.zulipchat.com/).

Good luck and happy contributing!
