# Begin from the cypress image so that we get all of the browsers.
FROM cypress/browsers:node16.14.2-slim-chrome100-ff99-edge

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=America/New_York

# Install some base dependencies
# firefox-esr is included here because it is not in the cypress
# image for arm64 at this time.
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
        firefox-esr \
        chromium

# Install the XFCE4 desktop environment.
# Note: Power management does not work inside docker so it is removed.
RUN apt install -y --no-install-recommends \
        xfce4=4.16 \
        xfce4-goodies=4.14.0 \
        xfce4-terminal=0.8.10-1 -y \
 && apt autoremove -y \
        xfce4-power-manager

# Install the Tiger VNC server, the noVNC server and dbus-x11 depndency.
# Also rename vnc.html so that the the noVNC server can be accessed
# more directly.
RUN apt install -y --no-install-recommends \
        tigervnc-standalone-server \
        tigervnc-common \
        dbus-x11 \
        novnc \
        net-tools \
 && cp /usr/share/novnc/vnc.html /usr/share/novnc/index.html

# Install some standard tools that are used in FarmData2 development.
RUN apt install -y --no-install-recommends \
        sudo \
        git \
        nano \
        meld \
 && npm install -g \
        @vue/cli@5.0.8 \
        jsdoc@3.6.7 \
        jsdoc-escape-at \
        jsdoc-vuejs@3.0.9 \
        vue-template-compiler@2.6.14

# Install VSCodium.  Note: Extensions are installed later so that
# they are installed just for the fd2dev user.
COPY vscodium.bash .
RUN ./vscodium.bash \
 && rm vscodium.bash

# Add environment variable to /etc/profile so that VSCodium
# launches on Windows with WSL without a warning.
ENV DONT_PROMPT_WSL_INSTALL=1

# Install Docker because we use Docker On Docker to allow some scripts
# (e.g. docker/setDB.bash and buildSampleDB.bash) to stop and start 
# containers.
 COPY docker.bash .
 RUN ./docker.bash \
  && rm docker.bash

# Clean up the xfce Applications menu because browser links don't work.
# Would be nice to make these work instead...
RUN rm -f /usr/share/applications/firefox.desktop \
 && rm -r /usr/share/applications/chromium.desktop \
 && rm -f /usr/share/applications/google-chrome.desktop \
 && rm -f /usr/share/applications/microsoft-edge-dev.desktop

# Create the "fd2dev" user and "fd2grp" group in the container.
# All files and directories for fd2dev, both on the host and in the
# container will be assigned to this group. In addition, all new files 
# and directories created by fd2dev in the container will belong to this group.  
# This is done to ensure that the fd2dev user in the container can edit the
# files mounted from the host when the host is a Linux OS.  Note: This is
# not necessary on Windows or MacOS but the container side behaves this way
# on those hosts as well for consistency.
#
# The GID for the fd2grp group is read from the dev/fd2grp.gid file.  
# That allows the GID to be easily changed in the event that a group with 
# that GID already exists on the host. This is handled in docker/fd2-up.bash.  
# We also ensure that the fd2dev user's primary group has the same GID so that
# new files and dirs are created with the right permissions.
# NOTE: These ARGS are used here, but may be hard coded in other
#       files in this dev directory.  Change them with caution.
ARG USERNAME=fd2dev
ARG PASSWD=fd2dev
ARG GROUP=fd2grp
COPY ./fd2grp.gid .
RUN groupadd --gid $(cat ./fd2grp.gid) $GROUP \
 && useradd \
    -m $USERNAME -p "$(openssl passwd -1 $PASSWD)" \
    -g $GROUP \  
    -s /bin/bash \
    -G sudo \
 && rm fd2grp.gid

# Modify the default umask for the sytsem so that when files
# or directories are created the group has RW permisison as
# well as the owner.  That will ensure tha that any new files
# or directories created in the container are writeable on
# a Linux host.
COPY ./umask.bash .
RUN ./umask.bash \
 && rm ./umask.bash

##
##
## From here down each section assumes that it starts with
## the non-root fd2dev user and with the working directory being that
## users home directory.  If a user or directory change is made
## in a section it should restore these assumptions.
##
USER $USERNAME
WORKDIR /home/$USERNAME

# Install necessary dependencies for Vue/Cypress testing.  These are all
# installed into the /home/fd2dev/fd2test directory in the container.
#
# The echo "y" handles issues when vue create fails due to:
#    Your connection to the default yarn registry seems to be slow.
RUN echo "y" | vue create \
        --no-git \
        --bare \
        --skipGetStarted \
        --packageManager npm \
        --preset 'Default (Vue 2)' \
        fd2test
WORKDIR /home/$USERNAME/fd2test
RUN npm install -d \
        cypress@12.2.0 \
        webpack@5.74.0 \
        @cypress/webpack-dev-server@2.5.0 \
        @cypress/vue2@1.1.2 \
        path@0.12.7 \
        axios@0.24.0 \
        bootstrap@3.3.7
        
WORKDIR /home/$USERNAME

# Configure the VNC server so that it allows fd2dev to connect without
# a login.
RUN touch .Xauthority \
 && mkdir .vnc \
 && /bin/bash -c "echo -e '$PASSWD\n$PASSWD\nn' | vncpasswd; echo;"
COPY --chown=$USERNAME:$USERNAME ./xstartup .vnc/xstartup
USER root
RUN echo ":1=$USERNAME" >> /etc/tigervnc/vncserver.users \
 && chmod +x .vnc/xstartup
USER $USERNAME

# Do some basic git configuration.
RUN git config --global credential.helper store \
 && git config --global merge.conflictstyle diff3 \
 && git config --global merge.tool meld \
 && git config --global mergetool.keepBackup false

# Install some useful VSCodium extensions
RUN codium --install-extension streetsidesoftware.code-spell-checker

# Add some scripts for the running container.
RUN mkdir .fd2 \
 && mkdir -p .config/autostart
# startup.bash is run when the container starts.  It sets the ownership and group
# for the FarmData2 repo and the fd2test directories and starts the VNC and noVNC
# servers.
COPY --chown=$USERNAME:$USERNAME ./startup.bash ./.fd2/startup.bash
# .bash_aliases defines a few shortcut commands that are useful when doing FarmData2
# development work.
COPY --chown=$USERNAME:$USERNAME ./bash_aliases ./.bash_aliases
# panel.bash configures the launcheer panel at the bottom of the XFCE4 desktop by adding
# icons for Mousepad, VSCodium and Firefox...
COPY --chown=$USERNAME:$USERNAME ./panel.bash ./.fd2/panel.bash
# panel.desktop ensures that the panel.bash script is run when the XFCE4 desktop is started.
COPY --chown=$USERNAME:$USERNAME ./panel.desktop ./.config/autostart/panel.desktop
# terminalrc has the setting that enables unicode in the terminal
COPY --chown=$USERNAME:$USERNAME ./terminalrc ./.config/xfce4/terminal/terminalrc
RUN chmod +x .fd2/startup.bash \
 && chmod +x .fd2/panel.bash \
 && chmod +x .config/autostart/panel.desktop

# Set permissions on the test directory in the container so that the fd2grp 
# is able to read and write them.
USER root
RUN chgrp -R $GROUP /home/$USERNAME/fd2test \
 && chmod -R g+rw /home/$USERNAME/fd2test
USER $USERNAME

# Augment the .bashrc file so that anytime a terminal is opened in the
# development environemnt it is ensured that theffd2dev user is the 
# fd2docker group and that fd2grp is the users primary group.  This ensures
# that fd2dev can access the /var/run/docker.sock file for Docker On Docker. 
# And that new files and directories that are created are in the fd2grp group.
COPY --chown=$USERNAME:$USERNAME ./bashrc_addition ./.fd2/bashrc_addition
RUN cat .fd2/bashrc_addition >> .bashrc

# Stuff to reduce image size.
USER root
RUN apt autoclean -y \
 && apt autoremove -y \
 && rm -rf /var/lib/apt/lists/* \
 && rm /libappindicator3-1_0.4.92-7_amd64.deb
USER $USERNAME

# Run the startup.bash script to ensure that file permissions are correct
# and that the VNC and noVNC servers are running.
ENTRYPOINT ./.fd2/startup.bash
