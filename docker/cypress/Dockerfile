# Derived from the Docker file:
# https://github.com/cypress-io/cypress-docker-images/tree/master/included/7.4.0

# Any updates to this Dockerfile should also be accompanied by a bump
# in the version number in the farmdata2_modules/testrunner.bash 
# script so that the image will be rebuilt for anyone using it.
FROM cypress/browsers:node14.16.0-chrome89-ff77

# Update the dependencies to get the latest and greatest (and safest!) packages.
# Updating here breaks things if packages move on.  As this is purely a
# dev tool it's better to stay fixed and not break.
# RUN apt-get update && apt-get upgrade -y

# avoid too many progress messages
# https://github.com/cypress-io/cypress/issues/1243
ENV CI=1

# disable shared memory X11 affecting Cypress v4 and Chrome
# https://github.com/cypress-io/cypress-docker-images/issues/270
ENV QT_X11_NO_MITSHM=1
ENV _X11_NO_MITSHM=1
ENV _MITSHM=0

# should be root user
RUN echo "whoami: $(whoami)"
RUN npm config -g set user $(whoami)

# command "id" should print:
# uid=0(root) gid=0(root) groups=0(root)
# which means the current user is root
RUN id

# point Cypress at the /root/cache no matter what user account is used
# see https://on.cypress.io/caching
#ENV CYPRESS_CACHE_FOLDER=/root/.cache/Cypress
#RUN npm install -g "cypress@7.4.0"
#RUN cypress verify

# Cypress cache and installed version
# should be in the root user's home folder
#RUN cypress cache path
#RUN cypress cache list
#RUN cypress info
#RUN cypress version

# give every user read access to the "/root" folder where the binary is cached
# we really only need to worry about the top folder, fortunately
#RUN ls -la /root
#RUN chmod 755 /root

# always grab the latest Yarn
# otherwise the base image might have old versions
# NPM does not need to be installed as it is already included with Node.
RUN npm i -g yarn@1.22.10

# Add the vue command line interface tool
RUN npm install -g vue@2.6.13 @vue/cli@4.5.13

# Make a vue project into which the fd2 testing will be mounted
RUN vue create -d fd2test --packageManager npm

# Add cypress compontent testing and axios to the Vue project.
WORKDIR fd2test
RUN npm install --save-dev cypress@7.4.0 @cypress/vue@2.2.3 @cypress/webpack-dev-server@1.3.1 webpack-dev-server@3.11.2
RUN npm install --save-dev axios

# should print Cypress version
# plus Electron and bundled Node versions
RUN npx cypress version

RUN echo  " node version:    $(node -v) \n" \
  "npm version:     $(npm -v) \n" \
  "yarn version:    $(yarn -v) \n" \
  "debian version:  $(cat /etc/debian_version) \n" \
  "user:            $(whoami) \n" \
  "chrome:          $(google-chrome --version || true) \n" \
  "firefox:         $(firefox --version || true) \n"

ENTRYPOINT ["npx", "cypress", "open"]