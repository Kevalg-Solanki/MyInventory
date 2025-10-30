const tenantDeactivationEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Tenant Deactivated - My Inventory</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;
      line-height:1.6; color:#333333; background-color:#f8fafc;
    }
    .email-container {
      max-width:600px; margin:0 auto; background-color:#ffffff;
      box-shadow:0 4px 6px rgba(0,0,0,0.1);
    }
    .header {
      background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
      padding:40px 30px; text-align:center;
    }
    .logo { color:#ffffff; font-size:28px; font-weight:bold; margin-bottom:8px; letter-spacing:-0.5px; }
    .tagline { color:#e2e8f0; font-size:14px; font-weight:400; }
    .content { padding:50px 30px; text-align:left; }
    .title { font-size:22px; font-weight:700; color:#1a202c; margin-bottom:12px; }
    .message { font-size:16px; color:#4a5568; margin-bottom:24px; }
    .highlight {
      background:#fffbea; border:1px solid #f6e05e; color:#744210;
      padding:16px; border-radius:8px; margin:20px 0;
    }
    .meta {
      background:linear-gradient(135deg,#f7fafc 0%,#edf2f7 100%);
      border:2px solid #e2e8f0; border-radius:12px; padding:20px; margin:24px 0;
    }
    .meta h3 { font-size:14px; color:#2d3748; text-transform:uppercase; letter-spacing:.5px; margin-bottom:10px; }
    .meta-item { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px dashed #e2e8f0; }
    .meta-item:last-child { border-bottom:none; }
    .meta-label { color:#718096; font-size:14px; }
    .meta-value { color:#2d3748; font-weight:600; font-size:14px; }
    .actions { margin:28px 0; }
    .btn {
      display:inline-block; padding:12px 18px; border-radius:8px; text-decoration:none;
      font-weight:600; margin-right:12px;
    }
    .btn-primary { background:#667eea; color:#ffffff; }
    .btn-outline { color:#667eea; border:1px solid #667eea; background:#ffffff; }
    .note { font-size:13px; color:#718096; margin-top:12px; }
    .footer {
      background-color:#2d3748; color:#a0aec0; padding:30px; text-align:center; font-size:14px;
    }
    .footer-logo { color:#ffffff; font-size:18px; font-weight:bold; margin-bottom:12px; }
    .footer-links { margin-top:20px; }
    .footer-links a { color:#667eea; text-decoration:none; margin:0 15px; }
    .footer-links a:hover { text-decoration:underline; }

    @media only screen and (max-width:600px) {
      .email-container { margin:0; box-shadow:none; }
      .header, .content, .footer { padding:30px 20px; }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">My Inventory</div>
      <div class="tagline">Smart Inventory Management System</div>
    </div>

    <!-- Main Content -->
    <div class="content">
      <h1 class="title">Tenant Deactivated</h1>
      <p class="message">
        This is to inform you that the tenant <strong>[[tenantName]]</strong> has been <strong>deactivated</strong> by <strong>[[actedByName]]</strong> on <strong>[[deactivatedAt]]</strong>. During deactivation, users will not be able to access dashboards, products, sales, or perform any write operations for this tenant.
      </p>

      <div class="highlight">
        If this action was not intended, you can request a reactivation within <strong>[[reactivationWindowHours]]</strong> hours, subject to your role and organization policy.
      </div>

      <div class="meta">
        <h3>Tenant details</h3>
        <div class="meta-item">
          <span class="meta-label">Tenant</span>
          <span class="meta-value">[[tenantName]]</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Tenant ID</span>
          <span class="meta-value">[[tenantId]]</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Status</span>
          <span class="meta-value">Deactivated</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Reason</span>
          <span class="meta-value">[[reason]]</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Performed by</span>
          <span class="meta-value">[[actedByName]] ([[actedByEmail]]) ([[actedByMobile]])</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Deactivated at</span>
          <span class="meta-value">[[deactivatedAt]]</span>
        </div>
      </div>

      <div class="actions">
        <a href="[[manageTenantUrl]]" class="btn btn-primary">Manage Tenant</a>
        <a href="[[requestReactivationUrl]]" class="btn btn-outline">Request Reactivation</a>
        <div class="note">These actions require appropriate permissions and may be audited.</div>
      </div>

      <div class="highlight">
        <strong>Data Retention:</strong> Your data remains stored and secure while the tenant is deactivated. Exports and backups may be restricted depending on policy. Contact support if you need assistance.
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-logo">My Inventory</div>
      <div>Streamline your inventory management with confidence</div>
      <div>© 2025 My Inventory. All rights reserved.</div>
      <div class="footer-links">
        <a href="[[helpCenterUrl]]">Help Center</a>
        <a href="[[contactSupportUrl]]">Contact Support</a>
        <a href="[[privacyPolicyUrl]]">Privacy Policy</a>
      </div>
    </div>
  </div>
</body>
</html>
`;

module.exports = tenantDeactivationEmailTemplate;
