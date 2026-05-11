# Firewall Logs Configuration

To forward firewall logs to your SIEM (Wazuh/Elasticsearch), follow these general steps:

1. **Configure Syslog Forwarding on the Firewall**:
   - Access the firewall's administration interface.
   - Navigate to **Log Settings** or **Syslog Server** configuration.
   - Add the IP address of your Wazuh Manager or a dedicated log collector.
   - Set the port (usually UDP 514).
   - Select the facility and severity level to forward (e.g., Traffic logs, Threat logs).

2. **Configure Wazuh Manager to Receive Syslog**:
   Add the following to `/var/ossec/etc/ossec.conf` on the Wazuh Manager:
   ```xml
   <ossec_config>
     <remote>
       <connection>syslog</connection>
       <port>514</port>
       <protocol>udp</protocol>
       <allowed-ips>192.168.1.1/24</allowed-ips> <!-- Replace with your firewall's IP subnet -->
     </remote>
   </ossec_config>
   ```

3. **Restart Wazuh Manager**:
   ```bash
   systemctl restart wazuh-manager
   ```
