## Installing FarmData2 ##

This document provides a guide to installing the FarmData2 project.  There are separate sections for doing a developer install and a user install.  If you are interested in working on and contributing to the FarmData2 project follow the Developer Install section.  If you are interested in using the FarmData2 application follow the User Install section.

### User Install ###

FarmData2 is currently in the early stages of development and thus is not ready for independent use.  This section will be updated when FarmData2 has reached a state of development that is suitable for use.  In the meantime, please contact braught@dickinon.edu or allen@npfi.org for credentials if you would like to explore the trial instance available at [FarmData2 Trial](http://npfi.org/farmdata2/).  

### Developer Install ###

Before beginning this install please review the [CONTRIBUTING.md](CONTRIBUTING.md) document and in particular be sure to follow the links to the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) that sets the expectations for the FarmData2 community.

#### Development Platform ####

We recommend [Ubuntu Linux](https://ubuntu.com/) as the development platform for FarmData2.  It is the development platform used by the core team and thus is the most well understood and most fully tested. Users of Windows and MacOS should consider using Ubuntu Linux within [Virtual Box](https://www.virtualbox.org/) as their development platform. The It's FOSS guide to [Install Linux Inside Windows Using VirtualBox](https://itsfoss.com/install-linux-in-virtualbox/) is a good place to start if you are unfamiliar with this process.  This is a guide for Windows, but works equally well for MacOS with a little adaptation.

That said, developers experienced with tools like git, docker and docker-compose should not face any substantial barriers to development on Windows, MacOS or other Linux flavors.

#### Prerequisites ####

FarmData2 relies on a few prerequisite programs that will need to be installed on your development platform. You will need to install:
  * git
  * docker
  * docker-compose

Under Ubuntu Linux these tools can most easily be installed using the [apt](https://wiki.debian.org/AptCLI) or [synaptic](https://wiki.debian.org/Synaptic) package managers.  You might read the It's FOSS Complete guide to [Using apt Commands in Linux](https://itsfoss.com/apt-command-guide/) if you are unfamiliar with apt.

Full installation details for other platforms can be obtained from the projects themselves on the following sites:

  * [Intallling git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  * [Get Docker](https://docs.docker.com/get-docker/)
  * [Install Compose](https://docs.docker.com/compose/install/)

#### Linux Docker Configuration ####

If you are developing under Linux you will need to be able to [Manage Docker as a non-root user](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user).  To do so you need to add your user to the `docker` group. Use the following commands:
```
sudo groupadd docker
sudo usermod -aG docker $USER
```

Then log out and back into the system. When you log back in your user will have the permissions needed in order to use docker commands.

#### Getting FarmData2 ####

FarmData2 is hosted in a GitHub repository that can be found here:

  * [FarmData2 GitHub Repository](https://github.com/DickinsonCollege/FarmData2)

To get started:

  1. [Create a GitHub Account](https://github.com/join) (if you do not already have one).
  1. [Fork the FarmData2 repository](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo) into your own GitHub account.
  1. [Clone your fork](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository) of FarmData2 to your development machine.
  1. [Set your upstream remote](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork) to point to the main [FarmData2 repository](https://github.com/DickinsonCollege/FarmData2) at https://github.com/DickinsonCollege/FarmData2.

#### Bringing Up FarmOS ####

FarmData2 is a set of features and customizations that are built on top of the [FarmOS](https://github.com/farmOS) platform. The following steps will start the FarmOS system using docker-compose and will guide you through the process of configuring FarmOS.  Subsequent sections wiill then add the FarmData2 customizations.

  1. Change into the `FarmData2/docker` directory in a terminal on your development machine and use the following command:
  ```
  sudo docker-compose up -d
  ```
  Executing this command takes a few minutes, but will establish a running version of FarmOS. The command has completed when your command prompt returns.

  1. Open a browser and go to:
  ```
  http://localhost:8181
  ```
  If everything has worked you will see a phpMyAdmin login screen.

  phpMyAdmin is a graphical tool fpr interacting with the database that is used by FarmOS. We will use it to import the FarmData2 configuration and data into FarmOS.

  1. Log into phpMyAdmin using the credentials:
    * Username: `root`
    * Password: `farm`

  1. Use phpMyAdmin to add a new database user:
    1. Click the "User accounts" tab.
    1. Click "Add user account" in the "New" block.
    1. Fill in the fields:
      * Username: `farmdata2db`
      * Host: `%`
      * Password: `farmdata2db`
    1. In the "Database for user account" block check the boxes to:
      * "Create database with..."
      * "Grant all privileges..."
    1. Scroll to the bottom and click "Go".

  1. Open a browser (or another tab) and go to:
  ```
  http://localhost
  ```
  If everything has worked you will see a Drupal configuration screen. The FarmOS system runs on top of Drupal and some configuration must be done to connect the two.
    1. Choose language: Click "Save and continue" to install in English.
    1. Set up database: Fill in the fields:
      * Database name: `farmdata2db`
      * Database username: `farmdata2db`
      * Database password: `farmdata2db`
      * Under "ADVANCED OPTIONS:
          * Database host: `mariadb`
      * Click "Save and continue"
    1. Configure Site: Fill in the fields:
      * Site name: `Dickinson College Farm`
      * Site e-mail address: `<your e-mail>`
      * Username: `admin`
      * E-mail address: `<your e-mail>`
      * Password: `farmdata2`
      * Confirm Password: `farmdata2`
      * Default country: `United States`
      * Default time zone: `America/New York`
      * Click "Save and continue"
    1. Configure FarmOS:
      * Check all modules.
      * Choose "US/Imperial" System of measurement.
      * Click "Continue"
    1. Click "Visit your new site."

#### Adding FarmData2 Customizations ####

At this point we have a generic FarmOS installation running with an empty database crated for FarmData2.  This section customizes FarmOS into an instance of FarmData2.

  1. Copy the FarmData2 logo into the volume mounted into the container:
    1. Change into the `FarmData2/docker` directory in a terminal on your development machine (if not already there).
    1. Copy the file `farmdata2files/farmdata2logo.png` into the `www/sites/default/files` directory.
    ```
    sudo cp farmdata2files/farmdata2logo.png www/sites/default/files
    ```
    1. Set the owner and group of the copied logo file to the www-data user as required by FarmOS:
    ```
    sudo chown -R www-data:www-data www/sites/default/files/farmdata2logo.png
    ```

  1. Copy the FarmData2 custom modules into the directory mounted in the container:
    1. Change into the `FarmData2/docker` directory in a terminal on your development machine (if not already there).
    1. Copy the folders from the `farmdata2files/custommodules` directory into the `www/sites/all/modules` directory.
    ```
    sudo cp -r farmdata2files/custommodules/* www/sites/all/modules/
    ```
    1. Set the owner and group of the copied modules:
    ```
    sudo chown -R www-data:www-data www/sites/all/modules/farm_*
    ```

  1. Install the modules into FarmOS:
    1. Open a browser (or another tab) and go to the FarmData2 site (if not open already):
    ```
    http://localhost
    ```
    1. Log into FarmOS (if you were not automatically logged in) using:
      * Username: `admin`
      * Password: `farmdata2`
    1. Click "Manage" at the top left so that you see tabs for "Content", "Structure", "Appearance", etc...
    1. Open the "Modules" tab.
    1. Click "All" to display all available modules.
    1. Turn on the modules:
      * Farm Asset Property
      * Farm Eggs
      * Farm Material
      * Farm Organic
    1. Click "Save configuration"

#### Importing Sample Data ####

FarmOS has now been customized into a FarmData2 instance.  The next step is to import sample data from the Dickinson College farm so that new FarmData2 features can be added and tested.

  1. Change into the `FarmData2/docker` directory in a terminal on your development machine (if not already there).

  1. Copy the `php.ini` file into the `phpMyAdmin` container:
  ```
  docker cp php.ini phpmyadmin:/usr/local/etc/php
  docker exec phpmyadmin service apache2 restart
  ```
  Adding this file to the `phpMyAdmin` container configures phpMyAdmin to allow large imports as will be needed to import the FarmData2 database. Restarting apache2 ensures that phpMyAdmin uses the updated configuration.

  1. Open a browser (or a new tab) and go to the phpMyAdmin server:
  ```
  http://localhost:8181
  ```
    1. Log into phpMyAdmin (if not already logged in) using the credentials:
      * Username: `root`
      * Password: `farm`
    1. Click on the "Databases" tab.
    1. Click on "farmdata2db" (Note: Click the name, not the check box.)
    1. Scroll down and check the "Check all" box.
    1. From the "With selected" dropdown choose "Drop"
    1. Scroll down and click "Yes"
    1. Click the "Import" tab.
    1. Click "Browse" and choose the `FarmData2/docker/farmdata2files/farmdata2dbpartII.sql` file.
    1. Click "Go"

  1. Log into FarmData2:
    1. Open the FarmData site or reload it if is is already open:
    ```
    http://localhost
    ```
    1. Log in using:
      * Username: `admin`
      * Password: `farmdata2`

That's it! You now have a running version of FarmData2 that is suitable for development work.

#### Stopping and Starting FarmData2 ####

Now that you have installed and configured FarmDat2 you can stop and start it with the following commands:

  * To stop a running instance:
  ```
  docker-compose down
  ```

  * To re-start a stopped instance:
  ```
  docker-compose up -d
  ```

Note: Docker compose will remove the containers each time the down command is used and recreate them each time the up command is used. However, all of the persistent data is mounted from the development machine in the directories:
  * `FarmData2/docker/farmdata2files/db`
  * `FarmData2/docker/farmdata2files/www`
Thus, the newly created containers will have all FarmData2 settings, configuration and data.
