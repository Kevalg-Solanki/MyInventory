const forgotPassOtpEmailTemplate = `
<!DOCTYPE html> 
    <html lang="en"> 
    <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
    <title>Password Reset Verification - My Inventory</title> 
    <style> /* Reset styles */ * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        line-height: 1.6;
        color: #333333;
        background-color: #f8fafc;
    }
    
    .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px 30px;
        text-align: center;
    }
    
    .logo {
        color: #ffffff;
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
    }
    
    .tagline {
        color: #e2e8f0;
        font-size: 14px;
        font-weight: 400;
    }
    
    .content {
        padding: 50px 30px;
        text-align: center;
    }
    
    .greeting {
        font-size: 24px;
        font-weight: 600;
        color: #1a202c;
        margin-bottom: 16px;
    }
    
    .message {
        font-size: 16px;
        color: #4a5568;
        margin-bottom: 40px;
        line-height: 1.7;
    }
    
    .verification-box {
        background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        padding: 30px;
        margin: 40px 0;
        position: relative;
        overflow: hidden;
    }
    
    .verification-box::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 4px;
        background: linear-gradient(90deg, #667eea, #764ba2);
    }
    
    .verification-label {
        font-size: 14px;
        color: #718096;
        font-weight: 500;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .verification-code {
        font-size: 36px;
        font-weight: bold;
        color: #2d3748;
        letter-spacing: 8px;
        font-family: 'Courier New', monospace;
        background-color: #ffffff;
        padding: 20px 30px;
        border-radius: 8px;
        border: 1px solid #cbd5e0;
        display: inline-block;
        margin-bottom: 16px;
    }
    
    .code-note {
        font-size: 13px;
        color: #718096;
        font-style: italic;
    }
    
    .instructions {
        background-color: #f7fafc;
        border-left: 4px solid #667eea;
        padding: 20px;
        margin: 30px 0;
        text-align: left;
        border-radius: 0 8px 8px 0;
    }
    
    .instructions h3 {
        color: #2d3748;
        font-size: 16px;
        margin-bottom: 12px;
        font-weight: 600;
    }
    
    .instructions ol {
        color: #4a5568;
        font-size: 14px;
        padding-left: 20px;
    }
    
    .instructions li { margin-bottom: 8px; }
    
    .security-note {
        background-color: #fef5e7;
        border: 1px solid #f6e05e;
        border-radius: 8px;
        padding: 20px;
        margin: 30px 0;
    }
    
    .security-icon {
        color: #d69e2e;
        font-size: 20px;
        margin-bottom: 8px;
    }
    
    .security-text {
        font-size: 14px;
        color: #744210;
        line-height: 1.6;
    }
    
    .footer {
        background-color: #2d3748;
        color: #a0aec0;
        padding: 30px;
        text-align: center;
        font-size: 14px;
    }
    
    .footer-logo {
        color: #ffffff;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 12px;
    }
    
    .footer-text { margin-bottom: 8px; }
    
    .footer-links { margin-top: 20px; }
    
    .footer-links a {
        color: #667eea;
        text-decoration: none;
        margin: 0 15px;
    }
    
    .footer-links a:hover { text-decoration: underline; }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
        .email-container { margin: 0; box-shadow: none; }
        .header, .content, .footer { padding: 30px 20px; }
        .verification-code {
            font-size: 28px;
            letter-spacing: 4px;
            padding: 15px 20px;
        }
        .greeting { font-size: 20px; }
        .verification-box { padding: 20px; margin: 30px 0; }
    }
</style>
</head> <body> <div class="email-container"> <!-- Header --> <div class="header"> <div class="logo">My Inventory</div> <div class="tagline">Smart Inventory Management System</div> </div>

    <!-- Main Content -->
    <div class="content">
        <h1 class="greeting">Password Reset Verification</h1>
        <p class="message">
            A request was received to reset your password for My Inventory. To proceed, enter the verification code below on the password reset page. If you didn’t request this, you can safely ignore this email.
        </p>
        
        <!-- Verification Code Box -->
        <div class="verification-box">
            <div class="verification-label">Your Reset Code</div>
            <div class="verification-code">[[verification-code]]</div>
            <div class="code-note">This code expires in [[expireIn]] minutes</div>
        </div>
        
        <!-- Instructions -->
        <div class="instructions">
            <h3>How to reset your password:</h3>
            <ol>
                <li>Open the “Forgot Password” page in My Inventory</li>
                <li>Enter the 6‑digit code shown above</li>
                <li>Create a new secure password and confirm it</li>
                <li>Sign in with your new password</li>
            </ol>
        </div>
        
        <!-- Security Note -->
        <div class="security-note">
            <div class="security-icon">🔒</div>
            <div class="security-text">
                <strong>Security Notice:</strong> Do not share this code. My Inventory will never ask you for your OTP or password. If this wasn’t you, we recommend changing your account password and enabling additional security protections.
            </div>
        </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
        <div class="footer-logo">My Inventory</div>
        <div class="footer-text">Streamline your inventory management with confidence</div>
        <div class="footer-text">© 2025 My Inventory. All rights reserved.</div>
        <div class="footer-links">
            <a href="#">Help Center</a>
            <a href="#">Contact Support</a>
            <a href="#">Privacy Policy</a>
        </div>
    </div>
</div>
</body> </html>
`;

module.exports = forgotPassOtpEmailTemplate;
