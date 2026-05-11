# Attack Simulation and Testing Guide

To verify the SIEM system is actively detecting threats, perform the following simulated attacks:

## 1. SSH Brute Force Simulation (Linux)

Use `hydra` to simulate an SSH brute-force attack against the Linux agent.
```bash
# Example syntax
hydra -l root -P /path/to/wordlist.txt ssh://<target_linux_ip>
```
**Expected Outcome**: 
- Wazuh should trigger rule ID `100001` (or default `5712`/`5720`).
- An alert should appear in the Kibana Dashboard.

## 2. Windows Authentication Failure Simulation

Attempt to log in to the monitored Windows machine with an incorrect password multiple times.
**Expected Outcome**: 
- Windows Event ID `4625` (Failed Logon) is generated.
- Wazuh forwards this log and triggers a level 5+ alert.

## 3. Unauthorized Access to Sensitive Files

Modify a critical system file (e.g., `/etc/passwd` on Linux or a system file on Windows).
**Expected Outcome**:
- File Integrity Monitoring (FIM / syscheck) will detect the change and alert immediately.
