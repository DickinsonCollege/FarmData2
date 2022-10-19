FROM cypress/browsers:node16.14.2-slim-chrome100-ff99-edge

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=America/New_York

# Install some base dependencies
RUN apt update \
 && apt install -y --no-install-recommends \
        software-properties-common \
        gnupg2 \
        atfs \
        libsecret-1-0 \
        wget \
        curl \
        man \
        libpci3 \
        firefox-esr

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
        dbus-x11 \
        novnc \
        net-tools \
 && cp /usr/share/novnc/vnc.html /usr/share/novnc/index.html

# Install some standard tools
RUN apt install -y --no-install-recommends \
        sudo git nano meld \
 && npm install -g @vue/cli

# Install VSCodium
COPY vscodium.bash .
RUN ./vscodium.bash \
 && rm vscodium.bash

# Install Docker
 COPY docker.bash .
 RUN ./docker.bash \
  && rm docker.bash

# Clean up the xfce Applications menu because browser links don't work.
# Would be nice to make these work instead...
RUN rm -f /usr/share/applications/firefox.desktop \
 && rm -f /usr/share/applications/google-chrome.desktop \
 && rm -f /usr/share/applications/microsoft-edge-dev.desktop

# Create the "fd2dev" user and "fd2grp" group in the container.
# The GID of the group is read from the fd2grp.gid file.  That
# allows the GID to be easily changed in the event a user already
# has a group with the GID on their host (see fd2-up.bash).
ARG USERNAME=fd2dev
ARG PASSWD=fd2dev
ARG GROUP=fd2grp
COPY fd2grp.gid makefd2dev.bash .
RUN groupadd --gid $(cat ./fd2grp.gid) $GROUP \
 && useradd \
    -m $USERNAME -p "$(openssl passwd -1 $PASSWD)" \
    -s /bin/bash \
    -G sudo fd2grp \
 && rm fd2grp.gid makefd2dev.bash

##
## From here down each section assumes that it starts with
## the non-root user and with the working directory being that
## users home directory.  If a user or directory change is made
## in a section it should restore these assumptions.
##
USER $USERNAME
WORKDIR /home/$USERNAME

# Install necessary dependencies for Vue/Cypress testing.
### The echo "y" handles issues when vue create fails due to:
###    Your connection to the default yarn registry seems to be slow.
RUN echo "y" | vue create \
        --no-git \
        --bare \
        --skipGetStarted \
        --packageManager npm \
        --preset 'Default (Vue 2)' \
        fd2test
WORKDIR /home/$USERNAME/fd2test
RUN npm install -d \
        cypress \
        webpack \
        @cypress/webpack-dev-server \
        @cypress/vue2 \
        path \
        axios
WORKDIR /home/$USERNAME

# Configure the VNC server.
RUN touch .Xauthority \
 && mkdir .vnc \
 && /bin/bash -c "echo -e '$PASSWD\n$PASSWD\nn' | vncpasswd; echo;"
COPY --chown=$USERNAME:$USERNAME ./xstartup .vnc/xstartup
USER root
RUN echo ":1=$USERNAME" >> /etc/tigervnc/vncserver.users \
 && chmod +x .vnc/xstartup
USER $USERNAME

# Configure git to store credentials.
RUN git config --global credential.helper store

# Install some useful VSCodium extensions
RUN codium --install-extension streetsidesoftware.code-spell-checker

# Add some scripts for the running container.
RUN mkdir .fd2 \
 && mkdir -p .config/autostart
COPY --chown=$USERNAME:$USERNAME ./startup.bash ./.fd2/startup.bash
COPY --chown=$USERNAME:$USERNAME ./bash_aliases ./.bash_aliases
COPY --chown=$USERNAME:$USERNAME ./panel.bash ./.fd2/panel.bash
COPY --chown=$USERNAME:$USERNAME ./panel.desktop ./.config/autostart/panel.desktop
RUN chmod +x .fd2/startup.bash \
 && chmod +x .fd2/panel.bash \
 && chmod +x .config/autostart/panel.desktop

# Set permissions on the test directory in the container.
USER root
RUN chgrp -R $GROUP /home/fd2dev/fd2test \
 && chmod -R g+rw /home/fd2dev/fd2test
USER $USERNAME

# Augment the .bashrc file so that anytime a terminal is opened in the
# development environemnt it is ensured that the user is in a group
# that has the permissions to use the docker.sock.
COPY --chown=$USERNAME:$USERNAME ./bashrc_addition ./.fd2/bashrc_addition
RUN cat .fd2/bashrc_addition >> .bashrc

# Stuff to reduce image size.
USER root
RUN apt autoclean -y \
 && apt autoremove -y \
 && rm -rf /var/lib/apt/lists/* \
 && rm /libappindicator3-1_0.4.92-7_amd64.deb
USER $USERNAME

# Setup the initial container environment.
ENTRYPOINT ./.fd2/startup.bash
