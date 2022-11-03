# Docker use in FarmData2

FarmData2 uses Docker containers to run all of the elements of the system and the development environment. This document describes those containers, how they are built and how they are used.

## The Containers

There are 4 containers involved in the FarmData2 system:
* `fd2_dev`
  * The FarmData2 development environment runs in this container.  This includes the VNC server, the VSCodium IDE, the Cypress testing framework, etc.  Developers connect to this container using the TigerVNC Viewer. The FarmData2 repository from the host machine is mounted into this container for development work.
* `fd2_farmdata2`
  * FarmData2 runs in this container.  Code from the FarmData2 repository is also mounted into this container and runs on the underlying farmOS and Drupal services.
* `fd2_mariaDB`
  * The MariaDB Database service that manages all of the FarmData2 data runs in this container.  The actual database files are stored in a external Docker Volume.
* `fd2_phpmyadmin`
  * A PHPMyAdmin service runs in this container to assist developers with backend API development.

## The Images

When FarmData2 is started (via the `docker/fd2-up.bash` command) all images are pulled from [farmdata2](https://hub.docker.com/u/farmdata2) on dockerhub. All images in the farmdata2 dockerhub repo are multi-architecture images and support both arm64 and amd64. 

FarmData2 opts to pull all images from its own dockerhub repository to allow us to better control and freeze versions. In some cases, images from other dockerhub repositories (e.g. farmOS, mariaDB, ect) are updated or removed. In the past this has caused FarmData2 to break. This can be extremely disruptive when FarmData2 is being used during an academic semester, or eventually in production. Thus, even when an image on FarmData2 is exactly the same as it is on the authoritative source, we will use our own.

The images that are used are specified in the `docker/docker-compose.yml` file.

## Building the Images

Each image that can be build has its own directory in the `docker` directory (e.g. `dev`, `farmos`, `mariaDB`, `phpmyadmin`).  Each of those directories contains a `Dockerfile` and any additional files that are needed to build the image.  In addition, each of these directories contains a `repo.txt` file that specifies the image name and tag to be used for the image when it is built and pushed to the [farmdata2](https://hub.docker.com/u/farmdata2) dockerhub repository.  

The `docker/build-images.bash` script builds the images and pushes them to dockerhub. Run this script with no parameters to see a *usage* message describing how to build and push an image.

Note: In order to push the images it is necessary to log in to dockerhub with an account with write permission to the [farmdata2](https://hub.docker.com/u/farmdata2) dockerhub repository.

### Updating Images

When an image is modified the tag in its `repo.txt` file must be incremented.  For example, if `repo.txt` contains `dev:fd2.1` and a new version is being created, this file should be edited to contain `dev:fd2.2`.  This will cause a new image with the new tag to be built and pushed to dockerhub.

When a new tag is created and pushed, the `docker-compose.yml` file should also be updated to use the new tag for the image.  This ensures that the latest images will be pulled for developers when they synch with the upstream repository.

If significant changes are made to the `dev` container then it may also be necessary to bump the version number of the Docker volumes that is used to store the fd2dev user's home directory.