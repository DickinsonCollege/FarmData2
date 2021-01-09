FROM theiaide/theia

# Args will be overwritten from docker-compose file.
ARG HOST_UID=1000
ARG HOST_GID=1000
ARG HOST_USER=theia
ARG HOST_GROUP=theia

USER root

# Create the user and group from the host and
# reassign ownership of the relvant directories.
RUN apk add shadow && \
    userdel -r node && \
    groupadd -o -g $HOST_GID $HOST_GROUP && \
    useradd -o -m -u $HOST_UID -g $HOST_GID -s /bin/bash $HOST_USER && \
    mkdir /home/$HOST_USER/FarmData2 && \
    chown -R $HOST_UID:$HOST_GID /home/$HOST_USER && \
    chown -R $HOST_UID:$HOST_GID /home/theia && \
    rm -rf /home/project

ENV HOME /home/$HOST_USER/FarmData2
WORKDIR /home/$HOST_USER/FarmData2

ENV SHELL=/bin/bash \
    THEIA_DEFAULT_PLUGINS=local-dir:/home/theia/plugins \
    NODE_PATH=local-dir:/home/theia/node_modules

USER $HOST_USER
