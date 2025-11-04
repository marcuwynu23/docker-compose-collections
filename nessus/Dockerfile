FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    wget \
    libffi-dev \
    libssl-dev \
    ca-certificates \
    lsb-release \
    systemctl \
    && mkdir -p /opt/nessus

# Download the latest Nessus package (Community or Essentials)
RUN wget -O /tmp/nessus.deb "https://www.tenable.com/downloads/api/v1/public/pages/nessus/downloads/18036/download?i_agree_to_tenable_license_agreement=true" \
    && dpkg -i /tmp/nessus.deb || apt-get -f install -y \
    && rm /tmp/nessus.deb

EXPOSE 8834

CMD ["/opt/nessus/sbin/nessusd", "-D"]
