/*
 * Application configuration.
 *
 * Copy this file to .env or set environment variables accordingly
 * before running the application. These settings are specific to
 * your Azure AD tenant and registered application. You can find
 * these values in the Azure Portal after registering your app.
 */

require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  // Azure AD / Entra ID configuration
  aad: {
    clientId: process.env.AAD_CLIENT_ID || 'YOUR_CLIENT_ID',
    tenantId: process.env.AAD_TENANT_ID || 'YOUR_TENANT_ID',
    clientSecret: process.env.AAD_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
    authority: process.env.AAD_AUTHORITY || `https://login.microsoftonline.com/${process.env.AAD_TENANT_ID || 'common'}`,
    redirectUri: process.env.AAD_REDIRECT_URI || 'http://localhost:3000/redirect',
    // Optionally configure required app roles or group IDs here.
    scopes: [
      'User.Read',
    ],
  },
  // Power BI report embed configuration per group
  reports: {
    management: {
      name: 'Management dashboard',
      embedUrl: process.env.PBI_MANAGEMENT_EMBED_URL || '',
      reportId: process.env.PBI_MANAGEMENT_REPORT_ID || '',
      groupId: process.env.PBI_MANAGEMENT_WORKSPACE_ID || '',
    },
    operations: {
      name: 'Operations dashboard',
      embedUrl: process.env.PBI_OPERATIONS_EMBED_URL || '',
      reportId: process.env.PBI_OPERATIONS_REPORT_ID || '',
      groupId: process.env.PBI_OPERATIONS_WORKSPACE_ID || '',
    },
    finance: {
      name: 'Finance dashboard',
      embedUrl: process.env.PBI_FINANCE_EMBED_URL || '',
      reportId: process.env.PBI_FINANCE_REPORT_ID || '',
      groupId: process.env.PBI_FINANCE_WORKSPACE_ID || '',
    },
  },
};

module.exports = config;