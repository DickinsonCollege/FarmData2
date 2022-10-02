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

### Connecting to the FarmData2 Development Environment ###

FarmData2 provides a full featured Debian Linux based development environment.  This development environment is automatically running inside one of the Docker containers that was started by the `./fd2-up.bash` script.

**All of the FarmData2 instructions and documentation assume that you are working within the FarmData2 development environment.** That said, developers experienced with tools like git, docker and docker-compose should not face any substantial barriers to development directly on Windows, MacOS or other Linux flavors.

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

### Configure `git` in the Development Environment ###

Configure the git CLI within the FarmData2 development environment by:
1. Open a Terminal
2. `git config --global user.email "you@your.email"`
3. `git config --global user.name "your github username"`
4. [Create a personal access token](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token) in GitHub.
   * Set the "Expiration" to a reasonable duration.
   * Select the "repo" scope when creating the token.
   * Copy the token to the clipboard.
5. `cd FarmData2`
5. `git push origin main`
   * Enter your GitHub username
   * Paste in your personal access token.

Note: The git client in the FarmData2 development environment is set "store" your git credentials. This makes it so you do not have to re-enter your username and personal access token every time you `push`.  The "store" option is generally safe if you are using your own computer or working within a password protected account. The [Store your GitHub Credentials with the Git Credential Helper](https://techexpertise.medium.com/storing-git-credentials-with-git-credential-helper-33d22a6b5ce7) page contains more information about the "store" option and other options for how to manage your git credentials.

### Install the Sample Database Image ###

The FarmData2 repository contains a sample database with anonymized data from several years of operation of the [Dickinson College Farm](https://www.dickinson.edu/farm). This database is in the compressed file `docker/db.sample.tar.bz2` and needs to be expanded before it can be used. To install the sample database image:
1. Open a Terminal
2. `cd FarmDat2/docker`
3. `./setDB.bash sample`

When this command completes there should be a `db` directory in the `docker` directory.  The files in this `db` directory are a mySQL database that contain the sample data.  Note that you will only need to do this step once. But the above command can be used at any time to reset the database to its initial state.

### Logging Into FarmData2 ###

Open a browser within the FarmData2 development environment and go to:
```
http://fd2_farmdata2
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

Note: You may also connect to the running FarmData2 instance from a browser in your host OS (e.g. MacOS, Windows, Linux) using the URL:
```
http://localhost
```

### Editing Code & Documentation ###

The FarmData2 developer environment includes the VSCodium IDE.  This IDE is pre-configured with all of the extensions necessary for FarmData2 development. You can open this IDE and the FarmData2 project by:
1. Clicking the VSCodium icon dock at the bottom of the desktop.
2. Choosing "Open Folder" from the "File" menu.
3. Selecting "FarmDat2".
4. Clicking the "Open" button.
5. Confirm that you "trust the authors of the files in this folder", if asked.
6. Choose "Explorer" from the "View" menu to see the `FarmData2` file tree.

If you are using your own VSCode or VSCodium installation please refer to [docker/dev/Dockerfile](docker/dev/Dockerfile) file for information about the VSCodium extensions that are being used by the FarmData2 development environment.

### Stopping and Starting FarmData2 ###

The above process of installing and stetting up the FarmData2 development environment only needs to be completed once.  Once it is completed you will only need to start and stop the docker containers before and after each work session.

From the `docker` directory in the repository you can:

  * Stop FarmData2:
  ```
  ./fd2-down.bash
  ```

  * Start FarmData2:
  ```
  ./fd2-up.bash
  ```

## Technical Details ##

Below are some additional details that may be important for advanced development but, at least at first, may be safely ignored.

### Availability of phpMyAdmin ###

For developers working on back-end services and the FarmData2 data model there is a phpMyAdmin service that can be connected to via a browser in the FarmData2 development environment at:

```
http://fd2_phpmyadmin
```  

To see the live database being used log into phpMyAdmin using the credentials:
  * Username: `farm`
  * Password: `farm`

You can also connect to phpMyAdmin as an administrator using the credentials:
  * Username: `root`
  * Password: `farm`

Note: You may also connect to the phpMyAdmin service from a browser in your host OS (e.g. MacOS, Windows, Linux) using the URL:
```
http://localhost:8181
```

### Persistence ###

The [`docker/fd2-up.bash`](docker/fd2-up.bash) and [`docker/fd2-down.bash`](docker/fd2-down.bash) scripts start and stop all of the containers necessary for FarmData2. Some key points about how information is persisted between container starts and stops are described below.  The full details can be found in the [`docke/docker-compose.yml`](docker/docker-compose.yml) file.

#### Writeable Layers ####
When `./fd2-down.bash` is run `docker-compose` removes all of the containers, including their writeable layers.  The containers are all recreated, including blank writeable layers, each time the `fd2-up.bash` is used. However, all of the FarmData2 data and code is mounted from the development machine and thus will persist between uses. You can find all of the details of the mounted volumes in the `docker-compose.yml` file.

#### The FarmData2 Repository ####

The `FarmData2` repository on the host machine is mounted into `/home/fd2dev/FarmData2` in the FarmData2 development container.  The `FarmData2/contrib_modules` and the `FarmData2/farmdata2_modules` directories are mounted into the appropriate locations in the farmOS container. Thus, any changes made to the contents of the these directories either in the FarmData2 development environment or on the host machine will be reflected in the containers.

#### The Database ####

The farmOS/drupal database used by FarmData2 is stored in a Docker volume (`docker_farmos_db`)that is mounted into the FarmData2 development environment at `docker/db` and into the Maria DB container at `/var/lib/mysql`.  Using the Docker volume rather than the host filesystem to persist the database provides a significant performance boost.

#### The Dev Environment ####

The `home/fd2dev` directory in the FarmData2 development development environment is stored in a Docker volume (`docker_farmdev_home_fd2.x`).  In addition, the `fd2_dev` container is not deleted by `fd2-up.bash` or `fd2-down.bash`.  This allows individual customizations of the development environment to persist across runs. However, if it is necessary to make breaking changes to the development environment the version number of the container and the volume will be bumped in the `docker/docker-compose.yml` file which will create a new container and use a new blank volume.
