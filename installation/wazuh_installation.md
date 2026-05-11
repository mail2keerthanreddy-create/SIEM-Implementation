# Wazuh Installation Guide

Follow these instructions to install Wazuh Manager, Elasticsearch, and Kibana on an Ubuntu server.

1. **System Requirements**: 
   - 4GB+ RAM, 2+ CPU Cores, 50GB+ Storage
   - Ubuntu 20.04/22.04 LTS

2. **Quick Installation (All-in-one)**:
   ```bash
   curl -sO https://packages.wazuh.com/4.4/wazuh-install.sh
   curl -sO https://packages.wazuh.com/4.4/wazuh-install-files.tar
   sudo bash ./wazuh-install.sh -a
   ```

3. **Retrieve Passwords**:
   Once installation is complete, the script will output the default credentials.
   ```bash
   sudo tar -O -xvf wazuh-install-files.tar wazuh-install-files/wazuh-passwords.txt
   ```

4. **Access the Dashboard**:
   - Navigate to `https://<wazuh-server-ip>`
   - Log in using `admin` and the password retrieved from step 3.
