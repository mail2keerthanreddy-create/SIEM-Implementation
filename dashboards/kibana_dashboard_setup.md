# Kibana Dashboard Setup

1. **Access Kibana**:
   Open a web browser and go to the Kibana interface URL (typically provided after Wazuh installation).

2. **Navigate to Dashboards**:
   - Click on the menu icon and navigate to **Dashboard**.
   - Click **Create new dashboard**.

3. **Add Visualizations**:
   - Click **Add from library** if utilizing existing Wazuh dashboards.
   - For custom visualizations, click **Create visualization**.
   - Choose your chart type (e.g., Bar chart for failed logins, Pie chart for event categories).
   - Configure your data source (usually `wazuh-alerts-*` index pattern).

4. **Example Dashboard Components**:
   - **Failed Login Attempts Over Time**: Use a line or bar chart grouping by `@timestamp` and filtering by `rule.groups: "authentication_failures"`.
   - **Top Attack Sources**: Use a data table or pie chart grouped by `data.srcip`.
   - **Recent Security Alerts**: Add a saved search visualization to display raw alert details.

5. **Save the Dashboard**:
   Click **Save** in the top right, name the dashboard (e.g., "SIEM Overview"), and optionally store the time along with the dashboard.
