FROM ubuntu:22.04

# Install and configuration of TigerVNC is generally based on:
# https://www.howtoforge.com/how-to-install-vnc-server-ubuntu-22-04/

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update

RUN apt install sudo -y

# Install the desktop environment.
RUN apt install xfce4 xfce4-goodies xfce4-terminal -y
#RUN apt install ubuntu-desktop-minimal -y
#RUN apt install dbus-x11 -y

# Install Tiger VNC server.
RUN apt install tigervnc-standalone-server tigervnc-common tigervnc-tools -y

# Create the non-root user "farmdev" with sudo in the container.
ARG USERNAME=farmdev
ARG PASSWD=farmdev
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME -p "$(openssl passwd -1 $PASSWD)"
RUN usermod -G sudo $USERNAME

# Configure the VNC server.
RUN echo ":1=$USERNAME" >> /etc/tigervnc/vncserver.users
USER $USERNAME
WORKDIR /home/$USERNAME
RUN /bin/bash -c "echo -e '$PASSWD\n$PASSWD\nn' | vncpasswd"; echo;
COPY ./xstartup-xfce4 .vnc/xstartup
#COPY ./xstartup-gnome .vnc/xstartup
RUN touch .Xauthority
USER root
RUN chmod +x .vnc/xstartup
USER $USERNAME

# Install the noVNC application
RUN apt install novnc -y

# Install basic tools
    #  VSCode, gEdit, nano, atom
    #  Meld
    #  git
    #  npm, node.js
    #  browsers (chrome, firefox)

# Cypress

# Stuff to add to reduce image size.
#&& apt autoclean -y \
#&& apt autoremove -y \
#&& rm -rf /var/lib/apt/lists/*


CMD /bin/bash

#CMD vncserver -localhost no
