FROM ubuntu:22.04

# Contents of this Dockerfile were informed by:
# https://www.howtoforge.com/how-to-install-vnc-server-ubuntu-22-04/
# https://github.com/u1i/ubuntu-novnc
# https://installati.one/ubuntu/20.04/novnc/
# https://github.com/accetto/ubuntu-vnc-xfce-g3
# https://github.com/novnc/noVNC

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update

RUN apt install sudo -y

# Install the desktop environment.
RUN apt install xfce4 xfce4-goodies xfce4-terminal -y

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

# Install the noVNC application
RUN apt install novnc -y

# Configure the VNC server.
RUN echo ":1=$USERNAME" >> /etc/tigervnc/vncserver.users
USER $USERNAME
WORKDIR /home/$USERNAME
RUN /bin/bash -c "echo -e '$PASSWD\n$PASSWD\nn' | vncpasswd"; echo;
COPY ./xstartup .vnc/xstartup
RUN touch .Xauthority
#USER root
#RUN chmod +x .vnc/xstartup
#USER $USERNAME



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

# Launch the servers!
RUN mkdir .fd2
COPY ./startup.bash ./.fd2/startup.bash
CMD ./.fd2/startup.bash
