```text
                +----------------------+
                |      Firewall        |
                |    Network Logs      |
                +----------+-----------+
                           |
                           |
+-----------+      +-------v-------+       +----------------+
| Windows   |----->|               |------>|                |
| Machine   |      |  Wazuh Agent  |       |                |
| Event Log |      |               |       |                |
+-----------+      +-------+-------+       |                |
                           |               |                |
                           |               |                |
+-----------+      +-------v-------+       |   Wazuh        |
| Linux     |----->|               |------>|   Manager      |
| Server    |      |  Wazuh Agent  |       |                |
| Syslogs   |      |               |       |                |
+-----------+      +---------------+       |                |
                                           +-------+--------+
                                                   |
                                                   |
                                           +-------v--------+
                                           |  Elasticsearch |
                                           |  Log Storage   |
                                           +-------+--------+
                                                   |
                                                   |
                                           +-------v--------+
                                           |     Kibana     |
                                           | Security       |
                                           | Dashboard      |
                                           +----------------+
```

Tools used in architecture:
- Wazuh
- Elastic Stack
- Kibana

Note: A `.png` equivalent of this diagram is expected in this directory (e.g. `siem_architecture.png`). You can recreate this diagram in PowerPoint, Draw.io, or Lucidchart and save the resulting image here.
