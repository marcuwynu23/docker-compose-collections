FROM jenkins/inbound-agent:latest-jdk21

LABEL maintainer="Mark Wayne <marcuwynu23@gmail.com>"
LABEL description="Jenkins Inbound Agent with JDK17"

USER root

# Install node and npm 
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
		apt-get install -y nodejs && \
		npm install -g yarn
# Install git
RUN apt-get update && apt-get install -y git

# add here any other tools you need for jenkins agent
# depending on your build environment you might need to install
# maven, gradle, docker, kubectl, helm,argocd, etc.


USER jenkins


