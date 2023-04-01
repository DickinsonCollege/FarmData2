# Docker use in FarmData2

FarmData2 uses Docker containers to run all of the elements of the system and the development environment. This document describes those containers, how they are built, and how they are used.

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
  * The actual database files used by MariaDB are stored in an external Docker Volume for performance and persistence.
* `fd2_api`
  * A custom API for FarmData2 that accesses the farmOS database in the `fd2_mariaDB` container.  This API provides API endpoints that are specialized for FarmData2 and supplement the more general farmOS API endpoints.
  * The API code is mounted from the FarmData2 repository into this container and is monitored for changes so that they are reflected in the endpoints available and the results returned.
  * This API is accessible at `fd2_api` in the FarmData2 development environment.  It is also exposed on port 8080 of the `localhost`.  
* `fd2_phpmyadmin`
  * A PHPMyAdmin service runs in this container to assist developers with backend API development.
  * The PHPMyadmin service is accessible at `fd2_phpmyadmin` in the FarmData2 development environment.  It is also exposed on port 8181 of the `localhost`.  

## The Images

When FarmData2 is started (via the `docker/fd2-up.bash` command) all images are pulled from [farmdata2](https://hub.docker.com/u/farmdata2) on dockerhub. All images in the farmdata2 dockerhub repo are multi-architecture images and support both arm64 and amd64. 

FarmData2 opts to pull all images from its own dockerhub repository to allow us to better control and freeze versions. In some cases, images from other dockerhub repositories (e.g. farmOS, mariaDB, etc.) are updated or removed. In the past, this has caused FarmData2 to break. This can be extremely disruptive when FarmData2 is being used during an academic semester, or eventually in production. Thus, even when an image on FarmData2 is exactly the same as it is on the authoritative source, we will use our own.

The images that are used are specified in the `docker/docker-compose.yml` file.

## Persistence in Containers ##

The [`docker/fd2-up.bash`](docker/fd2-up.bash) and [`docker/fd2-down.bash`](docker/fd2-down.bash) scripts start and stop all of the containers necessary for FarmData2. Some key points about how information is persisted between container starts and stops are described below.  The full details can be found in the [`docke/docker-compose.yml`](docker/docker-compose.yml) file.

### Writeable Layers ###

When `./fd2-down.bash` is run, `docker-compose` removes all of the containers, including their writeable layers.  The containers are all recreated, including blank writeable layers, each time the `fd2-up.bash` is used. However, all of the FarmData2 data and code is mounted from the development machine and thus will persist between uses. You can find all of the details of the mounted volumes in the `docker-compose.yml` file.

### The FarmData2 Repository ###

The `FarmData2` repository on the host machine is mounted into `/home/fd2dev/FarmData2` in the FarmData2 development container.  The `FarmData2/contrib_modules` and the `FarmData2/farmdata2_modules` directories are mounted into the appropriate locations in the farmOS container. Thus, any changes made to the contents of the these directories either in the FarmData2 development environment or on the host machine will be reflected in the containers.

### The Database ### 

The farmOS/drupal database used by FarmData2 is stored in a Docker volume (`docker_farmos_db`) that is mounted into the FarmData2 development environment at `docker/db` and into the MariaDB container at `/var/lib/mysql`.  Using the Docker volume rather than the host filesystem to persist the database provides a significant performance boost.

### The Dev Environment ###

The `home/fd2dev` directory in the FarmData2 development environment is stored in a Docker volume (`docker_farmdev_home_fd2.x`).  If it is necessary to make breaking changes to the development environment, the version number of the container and the volume will be bumped in the `docker/docker-compose.yml` file, which will create a new container and use a new blank volume the next time `fd2-up.bash` is run.

## Building the Images

The `docker/build-images.bash` script builds the images and pushes them to dockerhub. Run this script with no parameters to see a *usage* message describing how to build and push an image.

Each image that can be built has its own directory in the `docker` directory (e.g. `api`, `dev`, `farmos`, `mariaDB`, `phpmyadmin`).  Each of those directories contains a `Dockerfile` and any additional files that are needed to build the image.  In addition, each of these directories contains the following files:
* `repo.txt`: Required file that specifies the image name and tag to be used for the image when it is built and pushed to the [farmdata2](https://hub.docker.com/u/farmdata2) dockerhub repository.  
* `before.bash`: Optional script that is run by `build-images.bash` just before the image is built.  This is useful for adding files from outside the build context into the build context.
* `after.bash`: Optional script that is run by `build-images.bash` just after the image is built. This is useful for doing any cleanup from operations performed by the `before.bash` script.

Note: In order to push the images, it is necessary to log in to dockerhub with an account with write permission to the [farmdata2](https://hub.docker.com/u/farmdata2) dockerhub repository.

### Updating Images

When an image is modified, the tag in its `repo.txt` file should be incremented.  For example, if `repo.txt` contains `dev:fd2.1` and a new version is being created, this file should be edited to contain `dev:fd2.2`.  This will cause a new image with the new tag to be built and pushed to dockerhub.

When a new tag is created and pushed, the `docker-compose.yml` file should also be updated to use the new tag for the image.  This ensures that the latest images will be pulled for developers the next time they use `fd2-up.bash` to start FarmData2 after they sync with the upstream repository.

If significant changes are made to the `dev` container, then it may also be necessary to bump the version number of the Docker volume that is used to store the fd2dev user's home directory. This will cause a new volume to be created for the user's home directory.

