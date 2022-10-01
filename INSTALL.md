# Installing FarmData2 #

This document provides a guide to installing the FarmData2 project.  There are separate sections for doing a developer install and a user install.  If you are interested in working on and contributing to the FarmData2 project follow the Developer Install section.  If you are interested in using the FarmData2 application follow the User Install section.

## Communications ##  

There is a dedicated [Install _stream_](https://farmdata2.zulipchat.com/#narrow/stream/270906-install) on the [FarmData2 Zulip chat](https://farmdata2.zulipchat.com). This is the place to ask and look for answers to your install related questions.

## User Install ##

FarmData2 is currently in the early stages of development and thus is not ready for production use.  This section will be updated when FarmData2 has reached a state of development that is suitable for use in the field.

## Developer Install ##

Before beginning this install please review the [CONTRIBUTING.md](CONTRIBUTING.md) document and in particular be sure to follow the links to the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) that sets the expectations for the FarmData2 community.

### Prerequisites ###

FarmData2 relies on a few prerequisites that will need to be installed on your computer. You will need to install
  * docker Desktop
  * git
  * TigerVNC Viewer

Full installation details for these tools can be obtained from the projects themselves on the following sites:

  * [Get Docker](https://docs.docker.com/get-docker/)
    * Test your install using the command: `docker run hello-world`
    * You should be able to run this command without `root` or `admin` privileges.
  * [Installing git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
    * Test your install using the command: `git --version`
  * TigerVNC Viewer - Download and install the viewer for your platform:
    * Windows: [vncviewer64-1.12.0.exe](https://sourceforge.net/projects/tigervnc/files/stable/1.12.0/vncviewer64-1.12.0.exe/download)
    * MacOS: [TigerVNC-1.12.0.dmg](https://sourceforge.net/projects/tigervnc/files/stable/1.12.0/TigerVNC-1.12.0.dmg/download)
    * Linux: [tigervnc-1.12.0.x86_64.tar.gz](https://sourceforge.net/projects/tigervnc/files/stable/1.12.0/tigervnc-1.12.0.x86_64.tar.gz/download)

### Getting FarmData2 ###

FarmData2 is hosted in a GitHub repository that can be found here:

  * [FarmData2 GitHub Repository](https://github.com/DickinsonCollege/FarmData2)

To get started:

  1. [Create a GitHub Account](https://github.com/join) (if you do not already have one).
  1. [Fork the FarmData2 repository](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo) into your own GitHub account.
  1. [Clone your fork](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository) of FarmData2 to your development machine.
  1. Change your directory to where you have cloned using `cd`.
  1. [Set your upstream remote](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork) to point to the main [FarmData2 repository](https://github.com/DickinsonCollege/FarmData2) at https://github.com/DickinsonCollege/FarmData2.

### Starting FarmData2 ###

To start FarmData2, ensure that docker is running and you are in the `docker` directory of the repository. Then, use the command below:
```
./fd2-up.bash
```

This command will start up the docker containers that are used by FarmData2. There will be lots of output from this command and the first time you run it, it may take a while to complete as it pulls, downloads and extracts the docker images to your machine. You will know the command is complete when it outputs:
```
FarmData2 started.
```

### Connecting to the Development Environment ###

The FarmData2 development environment is running inside one of the Docker containers that was started by the `./fd2-up.bash` script.

You can connect to the FarmData2 development environment using the TigerVNC Viewer as follows:
1. Run your TigerVNC Viewer
2. Set the "VNC Server" field to: `localhost:5901`
3. Click "Connect"

When the TigerVNC Viewer connects to the FarmData2 Development environment a window will open displaying the Desktop of the Debian Linux system that is running in the docker container. 

Your user credentials within the FarmData2 Development environment are:
* Username: `fd2dev`
* Password: `fd2dev`

The `fd2dev` is a member of the groups:
* `sudo`
* `docker`

### Configure git in the Development Environment ###

Configure the git CLI within the FarmData2 development environment by:
1. `git config --global user.email "you@your.email"`
2. `git config --global user.name "your github username"`
3. [Create a personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) in GitHub.
4. `git push upstream 



     - You will also probably want to [Store your GitHub Credentials with the Git Credential Helper](https://techexpertise.medium.com/storing-git-credentials-with-git-credential-helper-33d22a6b5ce7) to avoid retyping the token for every operation.

### Install the Sample Database Image ###

The FarmData2 repository contains a sample database with anonymized data from several years of operation of the [Dickinson College Farm](https://www.dickinson.edu/farm). This database is in the compressed file `docker/db.sample.tar.bz2` and needs to be expanded before it can be used.  Change into the `docker` directory in the repository and use the command below:
```
./setDB.bash sample
```

When this command completes there should be a `db` directory in the `docker` directory.  The files in this `db` directory are a mySQL database that contain the sample data.  Note that you will only need to do this step once. But the above command can be used at any time to reset the database to its initial state.


You now have a fully functional FarmData2 development environment.  All of the instructions and documentation within FarmData2 assume that you are working within this environment.  


### Logging Into FarmData2 ###

Open a browser and go to:
```
http://localhost
```
If everything has worked you will see the FarmData2 login screen.

![FarmData2 Login Screen](media/FarmData2Login.png)

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



### Development Platform ###

FarmData2 includes a fully condfigured Debian Linux based development environment.  This development environment will start automaticnd provides the quickest and easiest way to get started with FarmData2 development. All development can be done within this environment and it is started automatically with FarmData2. This envoriment 

We recommend Ubuntu Linux as the development platform for FarmData2.  It is the development platform used by the core team and thus is the most well understood and most fully tested. Users of Windows and MacOS should consider using Ubuntu Linux within [Virtual Box](https://www.virtualbox.org/) as their development platform.  

That said, developers experienced with tools like git, docker and docker-compose should not face any substantial barriers to development directly on Windows, MacOS or other Linux flavors.


### Editing Code & Documentation ###

The code and documentation can be edited with any editor.  For convenience, the FarmData2 installation includes a browser-based integrated development environment (IDE). To use this IDE open a browser tab and go to:
```
http://localhost:3000
```
When the IDE opens:
  1. Click "Open Workspace"
  1. Select the `FarmData2` directory
  1. Click "Open"

The explorer on the left will show the contents and structure of the FarmData2 repository. More information about getting started working on the FarmData2 code and documentation can be found in the [CONTRIBUTING](CONTRIBUTING.md) document.

### Stopping and Starting FarmData2 ###

The above process of installing FarmData2 only needs to be completed once.  Now you will need only to start and stop the docker containers before and after each work session.

From the `docker` directory in the repository you can:

  * Stop FarmData2:
  ```
  ./fd2-down.bash
  ```

  * Start FarmData2:
  ```
  ./fd2-up.bash
  ```

#### A Note on Persistence ####

The `fd2-up.bash` and `fd2-down.bash` scripts use `docker-compose` to start all of the FarmData2 containers.  When `./fd2-down.bash` is run `docker-compose` removes all of the containers, including their writeable layers.  The containers are all recreated, including blank writeable layers, each time the `fd2-up.bash` is used. However, all of the FarmData2 data and code is mounted from the development machine and thus will persist between uses. You can find all of the details of the mounted volumes in the `docker-compose.yml` file.

The FarmData2 database, that we expanded earlier, is mounted into the container from the directory:
  * `docker/db`

The FarmData2 code is mounted into the container from the directories:
  * `contrib_modules`
  * `farmdata2_modules`

Changes to the code in these directories on the development machine will be reflected by the instance of FarmData2 running in the container.

#### Availability of phpMyAdmin ####

For developers working on back-end services and the FarmData2 data model the installation starts a phpMyAdmin service that is available at `localhost:8181`.  

You can connect to this service as an administrator using the credentials:
  * Username: `root`
  * Password: `farm`

To see the live database in use you will use the credentials:
  * Username: `farm`
  * Password: `farm`
