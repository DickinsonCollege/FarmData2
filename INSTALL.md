## Installing FarmData2 ##

This document provides a guide to installing the FarmData2 project.  There are separate sections for doing a developer install and a user install.  If you are interested in working on and contributing to the FarmData2 project follow the Developer Install section.  If you are interested in using the FarmData2 application follow the User Install section.

### User Install ###

FarmData2 is currently in the early stages of development and thus is not ready for independent use.  This section will be updated when FarmData2 has reached a state of development that is suitable for use.  In the meantime, please contact braught@dickinon.edu or allen@npfi.org for credentials if you would like to explore the trial instance available at [FarmData2 Trial](http://npfi.org/farmdata2/).  

### Developer Install ###

Before beginning this install please review the [CONTRIBUTING.md](CONTRIBUTING.md) document and in particular be sure to follow the links to the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) that sets the expectations for the FarmData2 community.

#### Development Platform ####

We recommend [Ubuntu Linux](https://ubuntu.com/) as the development platform for FarmData2.  It is the development platform used by the core team and thus is the most well understood and most fully tested. Users of Windows and MacOS should consider using Ubuntu Linux within [Virtual Box](https://www.virtualbox.org/) as their development platform. The FOSS guide to [Install Linux Inside Windows Using VirtualBox](https://itsfoss.com/install-linux-in-virtualbox/) is a good place to start if you are unfamiliar with this process.  This is a guide for Windows, but works equally well for MacOS with a little adaptation.

That said, developers experienced with tools like git, docker and docker-compose should not face any substantial barriers to development on Windows, MacOS or other Linux flavors.

#### Prerequisites ####

FarmData2 relies on a few prerequisite programs that will need to be installed on your development platform. You will need to install
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

#### Expand Sample Database Image ####

The FarmData2 repository contains a sample database with anonymized data from several years of operation of the [Dickinson College Farm](https://www.dickinson.edu/farm). This database is in the compressed file `docker/db.tar.bz2` and needs to be expanded before it can be used.  Change into the `docker` directory in the repository and use the command below:
```
sudo tar --same-owner -xjf db.tar.bz2
```

When this command completes there should be a `db` directory in the `docker` directory.  The files in this `db` directory are a mySQL database that contain the sample data.

#### Starting FarmData2 ####

To start FarmData2 ensure that you are in the `docker` directory in the repository and use the commands below:
```
docker rm $(docker ps -a -q -f name=fd2_)
docker-compose up -d
```

The first command ensures that there are no old FarmData2 docker containers hanging around.  It will remove them if there are and will report that `docker rm requires at least 1 argument` if there are not.

The second command starts up the docker containers that are used by FarmData2. There will be lots of output from this command and the first time you run it, it may take a while to complete as it pull, downloads and extracts the docker images to your machine. When this process has completed you will see a line beginning with `fd2_phpmyadmin` followed by the current date and time.

#### Configuring Drupal ####

In order to start FarmData2 the Drupal on which it runs must be configured.

Open a browser and go to:
```
http://localhost
```
If everything has worked you will see a Drupal configuration screen with the heading "Choose language".

FarmData2 runs on the FarmOS system which in turn runs on top of Drupal. Some configuration is necessary to setup Drupal and connect it to the database that we expanded above.

  1. Choose language: Click "Save and continue" to install in English.

  1. Set up database: Fill in the fields:
     * Database name: `farmdata2db`
     * Database username: `farmdata2db`
     * Database password: `farmdata2db`
     * Under "ADVANCED OPTIONS:
       * Database host: `fd2_mariadb`
     * Click "Save and continue"

That's it! You now have a running version of FarmData2 that is loaded with the sample data set and is suitable for development work.

#### Logging Into FarmData2 ####

Open a browser (or a new tab) and go to:
```
http://localhost
```
If everything has worked you will see the FarmData2 login screen.
  1. Click on "Login to farmOS"
  1. Log in using one of the following credentials:
     * Administrator:
       * Username: `admin`
       * Password: `farmdata2`
     * Farm Managers:
       * Username: `manager1` (or `2`)
       * Password: `farmdata2`
     * Farm Workers:
       * Username: `worker1` (or `2`, `3`, `4`)
       * Password: `farmdata2`
     * Guest:
       * Username: `guest`
       * Password: `farmdata2`

#### Stopping and Starting FarmData2 ####

The above process of configuring FarmData2 only needs to be completed once.  Now you will need only to start and stop the docker containers before and after each work session.

From the `docker` directory in the repository you can:

* Stop FarmData2:
```
docker-compose down
```

* Start FarmData2:
```
docker-compose up -d
```

Note: Docker compose will remove the containers each time the down command is used and recreate them each time the up command is used. However, all of the persistent data is mounted from the development machine in the directories:
* `FarmData2/docker/farmdata2files/db`
* `FarmData2/docker/farmdata2files/www`
Thus, the newly created containers will have all FarmData2 settings, configuration and data.
