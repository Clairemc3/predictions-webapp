<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email Address</title>
    <link href="https://fonts.googleapis.com/css2?family=Archivo+Black:wght@400&family=Carme:wght@400&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Carme', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background-color: #420B50;
            color: #ffffff;
            padding: 30px 40px;
            text-align: center;
        }
        
        .header h1 {
            font-family: 'Archivo Black', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 28px;
            font-weight: 400;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px;
        }
        
        .greeting {
            font-size: 18px;
            color: #420B50;
            margin-bottom: 20px;
            font-weight: 500;
        }
        
        .message {
            font-size: 16px;
            color: #616161;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .verify-button {
            display: inline-block;
            background-color: #FFD54F;
            color: #000000;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-family: 'Archivo Black', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 20px 0;
            transition: background-color 0.3s ease;
        }
        
        .verify-button:hover {
            background-color: #FFC107;
        }
        
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        
        .alternative-text {
            font-size: 14px;
            color: #757575;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
        }
        
        .url-text {
            word-break: break-all;
            color: #420B50;
            font-size: 13px;
            margin-top: 10px;
        }
        
        .footer {
            background-color: #f5f5f5;
            padding: 30px 40px;
            text-align: center;
            color: #757575;
            font-size: 14px;
        }
        
        .footer-title {
            font-family: 'Archivo Black', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #420B50;
            font-size: 16px;
            margin-bottom: 8px;
        }
        
        .security-notice {
            background-color: #FFF8E1;
            border-left: 4px solid #FFD54F;
            padding: 16px 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        
        .security-notice p {
            color: #F57C00;
            font-size: 14px;
            margin: 0;
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content, .footer {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .verify-button {
                padding: 14px 24px;
                font-size: 13px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>PREDICTIONS LEAGUE</h1>
            <p>Email Verification Required</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hello {{ $user->name }},
            </div>
            
            <div class="message">
                Welcome to Predictions League! To complete your account setup and start making predictions, 
                we need to verify your email address.
            </div>
            
            <div class="message">
                Please click the button below to verify your email address and activate your account:
            </div>
            
            <div class="button-container">
                <a href="{{ $verificationUrl }}" class="verify-button">
                    Verify Email Address
                </a>
            </div>
            
            <div class="security-notice">
                <p><strong>Security Notice:</strong> This verification link will expire in 60 minutes for your security. 
                If you didn't create an account with us, please ignore this email.</p>
            </div>
            
            <div class="alternative-text">
                <p><strong>Having trouble with the button?</strong> Copy and paste the following URL into your web browser:</p>
                <div class="url-text">{{ $verificationUrl }}</div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-title">PREDICTIONS LEAGUE</div>
            <p>This email was sent to {{ $user->email }} because you registered for an account.</p>
            <p style="margin-top: 10px;">
                If you have any questions, please don't reply to this email. 
                Contact our support team through the website instead.
            </p>
        </div>
    </div>
</body>
</html>
