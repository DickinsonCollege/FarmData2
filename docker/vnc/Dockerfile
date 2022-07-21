FROM ubuntu:22.04

# Contents of this Dockerfile were informed by:
# https://www.howtoforge.com/how-to-install-vnc-server-ubuntu-22-04/
# https://github.com/u1i/ubuntu-novnc
# https://installati.one/ubuntu/20.04/novnc/
# https://github.com/accetto/ubuntu-vnc-xfce-g3
# https://github.com/novnc/noVNC

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update \
 && apt install -y --no-install-recommends \
        sudo

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
        tigervnc-standalone-server=1.12.0+dfsg-4 \
        tigervnc-common=1.12.0+dfsg-4 \
        tigervnc-tools=1.12.0+dfsg-4 \
        dbus-x11 \
        novnc



                    # Install basic tools
                        #  VSCode, gEdit, nano, atom
                        #  Meld
                        #  git
                        #  npm, node.js
                        #  browsers (chrome, firefox)

                    # Cypress



# Create the non-root user "farmdev" with sudo privileges in the container.
ARG USERNAME=farmdev
ARG PASSWD=farmdev
ARG USER_UID=1000
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

CMD ./.fd2/startup.bash
