# Wazuh Agent Setup Guide

This guide explains how to install and configure the Wazuh Agent on Windows and Linux targets.

## Linux Agent Installation (Ubuntu/Debian)

1. **Add Wazuh Repository**:
   ```bash
   curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | gpg --no-default-keyring --keyring gnupg-ring:/usr/share/keyrings/wazuh.gpg --import
   chmod 644 /usr/share/keyrings/wazuh.gpg
   echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | tee -a /etc/apt/sources.list.d/wazuh.list
   ```

2. **Install the Agent**:
   ```bash
   apt-get update
   WAZUH_MANAGER="<wazuh_manager_ip>" apt-get install wazuh-agent
   ```

3. **Start the Agent**:
   ```bash
   systemctl daemon-reload
   systemctl enable wazuh-agent
   systemctl start wazuh-agent
   ```

## Windows Agent Installation

1. **Download the Installer**:
   Download the MSI installer from the Wazuh Documentation.

2. **Run Installer via Command Line**:
   ```cmd
   wazuh-agent-4.x.x-1.msi /q WAZUH_MANAGER="<wazuh_manager_ip>" WAZUH_REGISTRATION_SERVER="<wazuh_manager_ip>"
   ```

3. **Start the Service**:
   ```cmd
   NET START WazuhSvc
   ```
