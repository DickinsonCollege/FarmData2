# Docker use in FarmData2

FarmData2 uses Docker containers to run all of the elements of the system and the development environment. This document describes those containers, how they are built and how they are used.

## The Containers

There are 5 containers involved in the FarmData2 system:
* `fd2_dev`
  * The FarmData2 development environment runs in this container.  
  * This container provides:
    * A VNC server accessible via port 5901 on the `localhost`.
    * A noVNC server accessible via port 6901 on the `localhost`.
    * An XFCE4 desktop with many standard development tools.
    * The Cypress testing framework configured for the FarmData2 project.
  * The FarmData2 repository from the host machine is mounted into the default user's home directory in this container.
* `fd2_farmdata2`
  * FarmData2 runs in this container.  
  * The server is accessible at `fd2_farmdata2` in the FarmData2 development environment.  It is also exposed on port 80 of the `localhost`.  
  * The code from the FarmData2 repository is mounted into this container and runs on the underlying farmOS and Drupal services.
* `fd2_mariaDB`
  * The MariaDB Database service that manages all of the FarmData2 data runs in this container.  
  * The actual database files used by MariaDB are stored in a external Docker Volume for performance and persistence.
* `fd2_api`
  * An custom api for FarmData2 that accesses the farmOS database in the `fd2_mariaDB` container.  This api provides api endpoints that are specialized for FarmData2 and supplement the more general farmOS api endpoints.
  * The api code is mounted from the FarmData2 repository into this container and is monitored for changes so that they are reflected in the endpoints available and the results returned.
  * This api is accessible at `fd2_api` in the FarmData2 development environment.  It is also exposed on port 8080 of the `localhost`.  
* `fd2_phpmyadmin`
  * A PHPMyAdmin service runs in this container to assist developers with backend API development.
  * The PHPMyadmin service is accessible at `fd2_phpmyadmin` in the FarmData2 development environment.  It is also exposed on port 8181 of the `localhost`.  

## The Images

When FarmData2 is started (via the `docker/fd2-up.bash` command) all images are pulled from [farmdata2](https://hub.docker.com/u/farmdata2) on dockerhub. All images in the farmdata2 dockerhub repo are multi-architecture images and support both arm64 and amd64. 

FarmData2 opts to pull all images from its own dockerhub repository to allow us to better control and freeze versions. In some cases, images from other dockerhub repositories (e.g. farmOS, mariaDB, ect) are updated or removed. In the past this has caused FarmData2 to break. This can be extremely disruptive when FarmData2 is being used during an academic semester, or eventually in production. Thus, even when an image on FarmData2 is exactly the same as it is on the authoritative source, we will use our own.

The images that are used are specified in the `docker/docker-compose.yml` file.

## Building the Images

The `docker/build-images.bash` script builds the images and pushes them to dockerhub. Run this script with no parameters to see a *usage* message describing how to build and push an image.

Each image that can be build has its own directory in the `docker` directory (e.g. `api`, `dev`, `farmos`, `mariaDB`, `phpmyadmin`).  Each of those directories contains a `Dockerfile` and any additional files that are needed to build the image.  In addition, each of these directories contains the following files:
* `repo.txt`: required file that specifies the image name and tag to be used for the image when it is built and pushed to the [farmdata2](https://hub.docker.com/u/farmdata2) dockerhub repository.  
* `before.bash`: Optional script that is run by `build-images.bash` just before the image is built.  This is useful for adding files from outside the build context into the build context.
* `after.bash`: Optional script that is run by `build-images.bash` just after the image is built. This is useful for doing any cleanup from operations performed by the `before.bash` script.

Note: In order to push the images it is necessary to log in to dockerhub with an account with write permission to the [farmdata2](https://hub.docker.com/u/farmdata2) dockerhub repository.

### Updating Images

When an image is modified the tag in its `repo.txt` file should be incremented.  For example, if `repo.txt` contains `dev:fd2.1` and a new version is being created, this file should be edited to contain `dev:fd2.2`.  This will cause a new image with the new tag to be built and pushed to dockerhub.

When a new tag is created and pushed, the `docker-compose.yml` file should also be updated to use the new tag for the image.  This ensures that the latest images will be pulled for developers the next time they use `fd2-up.bash` to start FarmData2 after they synch with the upstream repository.

If significant changes are made to the `dev` container then it may also be necessary to bump the version number of the Docker volume that is used to store the fd2dev user's home directory. This will cause a new volume to be created for the user's home directory.