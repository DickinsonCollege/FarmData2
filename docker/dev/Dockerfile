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

# Create the "fd2grp" and the non-root user "fd2dev" in the container.
ARG USERNAME=fd2dev
ARG PASSWD=fd2dev
ARG USER_UID=1001
ARG USER_GID=$USER_UID
ARG GROUP=fd2grp
ARG GROUP_GID=23432

RUN groupadd --gid $GROUP_GID $GROUP \
 && groupadd --gid $USER_GID $USERNAME \
 && useradd --uid $USER_UID --gid $USER_GID \
    -m $USERNAME -p "$(openssl passwd -1 $PASSWD)" \
    -s /bin/bash \
    -G sudo,docker,$GROUP

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
COPY --chown=$USERNAME:$USERNAME ./.bash_aliases ./.bash_aliases
COPY --chown=$USERNAME:$USERNAME ./panel.bash ./.fd2/panel.bash
COPY --chown=$USERNAME:$USERNAME ./panel.desktop ./.config/autostart/panel.desktop
RUN chmod +x .fd2/startup.bash \
 && chmod +x .fd2/panel.bash \
 && chmod +x .config/autostart/panel.desktop

# Update permissions on the fd2test directory so that Linux users can RW
RUN chgrp -R $GROUP /home/$USERNAME/fd2test \
 && chmod -R g+rw /home/$USERNAME/fd2test

# Stuff to reduce image size.
USER root
RUN apt autoclean -y \
 && apt autoremove -y \
 && rm -rf /var/lib/apt/lists/* \
 && rm /libappindicator3-1_0.4.92-7_amd64.deb
USER $USERNAME

# Setup the initial container environment.
ENTRYPOINT ./.fd2/startup.bash
