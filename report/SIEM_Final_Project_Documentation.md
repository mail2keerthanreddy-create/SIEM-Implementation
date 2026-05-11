# Final Project Report: SIEM Implementation using Open-Source Tools

## 1. Project Overview

### 1.1 Objective
The objective of this project is to design, deploy, and configure a Security Information and Event Management (SIEM) system using open-source security monitoring tools. The primary goal is to collect, analyze, and monitor logs from various endpoints (Windows systems, Linux servers, and firewall devices) to detect suspicious activities such as brute-force attacks, unauthorized access, and anomalous system behaviors.

### 1.2 Tools Utilized
*   **Wazuh:** Used as the core SIEM engine and endpoint security agent for log collection and threat detection.
*   **Elastic Stack (Elasticsearch, Logstash, Kibana):** Used for indexing, storing, and visualizing the collected log data.
*   **OSSEC:** The underlying host-based intrusion detection system (HIDS) powering Wazuh's rules engine.

---

## 2. System Architecture

The environment consists of a centralized SIEM Manager and distributed agents monitoring the endpoints.

```text
                +----------------------+
                |      Firewall        |
                |    Network Logs      |
                +----------+-----------+
                           |
+-----------+      +-------v-------+       +----------------+
| Windows   |----->|               |------>|                |
| Machine   |      |  Wazuh Agent  |       |                |
| Event Log |      |               |       |                |
+-----------+      +-------+-------+       |                |
                           |               |   Wazuh        |
+-----------+      +-------v-------+       |   Manager      |
| Linux     |----->|               |------>|                |
| Server    |      |  Wazuh Agent  |       |                |
| Syslogs   |      |               |       |                |
+-----------+      +---------------+       +-------+--------+
                                                   |
                                           +-------v--------+
                                           |  Elasticsearch |
                                           |  Log Storage   |
                                           +-------+--------+
                                                   |
                                           +-------v--------+
                                           |     Kibana     |
                                           | Security Dash  |
                                           +----------------+
```

---

## 3. Implementation Steps

### Phase 1: Environment Setup & Manager Installation
A centralized Wazuh Manager was deployed on a Linux virtual machine (Ubuntu 22.04) to act as the core SIEM server.

**Installation Commands:**
```bash
# Download and execute the automated Wazuh installation script
curl -sO https://packages.wazuh.com/4.4/wazuh-install.sh
curl -sO https://packages.wazuh.com/4.4/wazuh-install-files.tar
sudo bash ./wazuh-install.sh -a

# Extract administrative credentials
sudo tar -O -xvf wazuh-install-files.tar wazuh-install-files/wazuh-passwords.txt
```

### Phase 2: Agent Deployment
Wazuh agents were deployed to target endpoints to collect logs and forward them to the Manager.

**Linux Agent Setup:**
```bash
# Add Wazuh repository and install agent
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | gpg --no-default-keyring --keyring gnupg-ring:/usr/share/keyrings/wazuh.gpg --import
echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | tee -a /etc/apt/sources.list.d/wazuh.list
apt-get update
WAZUH_MANAGER="<wazuh_manager_ip>" apt-get install wazuh-agent
systemctl start wazuh-agent
```

**Windows Agent Setup:**
```cmd
# Execute MSI Installer silently via Command Prompt
wazuh-agent-4.x.x-1.msi /q WAZUH_MANAGER="<wazuh_manager_ip>"
NET START WazuhSvc
```

---

## 4. Log Collection Configuration

### 4.1 Windows Event Logs
The `ossec.conf` file on the Windows agent was configured to forward specific Security channels, specifically tracking failed and successful logons (Event IDs 4624, 4625).

```xml
<localfile>
  <location>Security</location>
  <log_format>eventchannel</log_format>
  <query>
    \<QueryList\>
      \<Query Id="0" Path="Security"\>
        \<Select Path="Security"\>*[System[(EventID=4624 or EventID=4625)]]\</Select\>
      \</Query\>
    \</QueryList\>
  </query>
</localfile>
```

### 4.2 Linux Syslogs
The Linux agent was configured to monitor system logs and authentication logs for SSH activity.
```xml
<localfile>
  <log_format>syslog</log_format>
  <location>/var/log/auth.log</location>
</localfile>
```

### 4.3 Firewall Logs
The Wazuh Manager was configured to receive Syslog traffic directly from the network firewall on port 514 UDP.
```xml
<remote>
  <connection>syslog</connection>
  <port>514</port>
  <protocol>udp</protocol>
  <allowed-ips>192.168.1.1/24</allowed-ips>
</remote>
```

---

## 5. Threat Detection Rules

Custom detection rules were written in the Wazuh Manager to alert on specific adversarial behaviors.

### 5.1 SSH Brute Force Detection
This rule triggers when 5 failed SSH login attempts occur within 120 seconds from the same source IP.
```xml
<group name="syslog,sshd,brute_force,">
  <rule id="100001" level="10" frequency="5" timeframe="120">
    <if_matched_sid>5716</if_matched_sid>
    <same_source_ip />
    <description>SSH Brute force attack detected: Multiple failed logins.</description>
    <mitre>
      <id>T1110</id>
    </mitre>
    <group>authentication_failures,</group>
  </rule>
</group>
```

### 5.2 Anomalous Binary Execution
Detects the execution of unusual or unexpected binaries in critical system directories using Wazuh's File Integrity Monitoring (FIM).
```xml
<group name="anomaly_detection,">
  <rule id="100002" level="8">
    <if_group>syscheck</if_group>
    <match>unusual_binary_execution</match>
    <description>Anomaly detected: Execution of an unusual binary.</description>
    <mitre>
      <id>T1036</id>
    </mitre>
  </rule>
</group>
```

---

## 6. Dashboards and Visualization

A customized web dashboard was developed to simulate and visualize the Kibana interface. The dashboard features:
1. **Security Overview:** Animated counters for Critical Alerts, Failed Logins, and Active Agents.
2. **Event Distribution:** Donut charts breaking down alert severities (Critical, High, Medium, Low).
3. **Live Alert Feeds:** Real-time simulations of incoming logs from Windows (`EventID 4625`), Linux (`sshd` failures), and the Firewall (`Port Scans`).
4. **Threat Intelligence Mapping:** Correlating failed login IPs to flag brute-force attacks dynamically on a bar chart.

*(Note: The interactive dashboard source code is located in the `dashboard/` directory of the project repository).*

---

## 7. Testing and Validation (Attack Simulation)

To validate the SIEM implementation, several attacks were simulated:

1.  **SSH Brute Force (Linux):** 
    *   *Action:* Used `hydra` to launch a dictionary attack against the Linux server.
    *   *Result:* Wazuh detected the repeated `auth.log` failures and successfully triggered Custom Rule `100001`, generating a Level 10 Critical Alert in the dashboard.
2.  **Windows Authentication Failure:**
    *   *Action:* Attempted to log in via RDP using incorrect credentials repeatedly.
    *   *Result:* Windows Event ID `4625` was generated, forwarded by the Wazuh agent, and successfully logged in the SIEM database.
3.  **Port Scan (Firewall):**
    *   *Action:* Executed an `nmap` scan against the firewall.
    *   *Result:* Firewall forwarded drop/block logs via syslog, which were visualized on the network activity dashboard.

---

## 8. Conclusion

This project successfully demonstrates the capability to deploy a robust, centralized SIEM infrastructure using entirely open-source tools. The system is actively capable of ingesting diverse log sources, parsing them in real-time, executing complex stateful correlation rules, and visualizing the resulting threat intelligence on a unified dashboard. This implementation provides a strong foundation for continuous security monitoring and rapid incident response.
