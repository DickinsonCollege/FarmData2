FROM cypress/included:10.3.0

ENV DEBIAN_FRONTEND=noninteractive

# Install base dependencies
RUN apt update \
 && apt install -y --no-install-recommends \
        software-properties-common

# Install the desktop environment.
# Note: Power management does not work inside docker so it is removed.
RUN apt install -y --no-install-recommends \
        xfce4=4.16 \
        xfce4-goodies=4.14.0 \
        xfce4-terminal=0.8.10-1 -y \
 && apt autoremove -y \
        xfce4-power-manager

# Install the Tiger VNC server, the noVNC server and dbus-x11 depndency.
RUN apt install -y --no-install-recommends \
        tigervnc-standalone-server \
        tigervnc-common \
#        tigervnc-tools \
        dbus-x11 \
        novnc \
        net-tools

# Install some standard tools
RUN apt install -y --no-install-recommends \
        sudo git nano gedit meld

# Install Firefox
#COPY firefox.bash .
#RUN ./firefox.bash \
# && rm firefox.bash

# Create the non-root user "farmdev" with sudo privileges in the container.
ARG USERNAME=farmdev
ARG PASSWD=farmdev
ARG USER_UID=1001
ARG USER_GID=$USER_UID
RUN groupadd --gid $USER_GID $USERNAME \
 && useradd --uid $USER_UID --gid $USER_GID \
    -m $USERNAME -p "$(openssl passwd -1 $PASSWD)" \
    -s /bin/bash \
    -G sudo

# Configure the VNC server.
RUN echo ":1=$USERNAME" >> /etc/tigervnc/vncserver.users
USER $USERNAME
WORKDIR /home/$USERNAME
RUN touch .Xauthority \
 && /bin/bash -c "echo -e '$PASSWD\n$PASSWD\nn' | vncpasswd"; echo;
COPY ./xstartup .vnc/xstartup

####### IS THERE OTHER STUFF TO DO HERE?
####### purge the cache? get rid of package files?
# Stuff to reduce image size.
USER root
RUN apt autoclean -y \
 && apt autoremove -y \
 && rm -rf /var/lib/apt/lists/*
USER $USERNAME

# Launch the servers!
RUN mkdir .fd2
COPY ./startup.bash ./.fd2/startup.bash
USER root
RUN chmod +x .vnc/xstartup \
 && chmod +x .fd2/startup.bash
USER $USERNAME

ENTRYPOINT ./.fd2/startup.bash
