import db from '../../src/index';

export async function createVerificationEmailTemplate(){

    const emailTemplateVerificationMail = await db.emailTemplate.create({
        data: {
            name: "verification-mail",
            subject: "Verify Your Email Address",
            from: "onboarding@bsamaritan.com",
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email Verification</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            color: #333333;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding: 10px 0;
                            background-color: #4CAF50;
                            color: #ffffff;
                            border-radius: 8px 8px 0 0;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content p {
                            font-size: 16px;
                            margin-bottom: 20px;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            font-size: 16px;
                            color: #ffffff;
                            background-color: #4CAF50;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                        .footer {
                            margin-top: 30px;
                            font-size: 12px;
                            color: #777777;
                            text-align: center;
                        }
                        .footer p {
                            margin: 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Verify Your Email</h1>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>Thank you for registering with us! Please click the button below to verify your email address:</p>
                            <a href="{{verification_link}}" class="button" style="color: white;">Verify Email</a>
                            <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
                            <p><a href="{{verification_link}}" style="color: #4CAF50;">{{verification_link}}</a></p>
                            <p>If you did not create an account, no further action is required.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Bayesian Labs. All rights reserved.</p>
                            <p>If you have any questions, feel free to <a href="mailto:support@bsamaritan.com" style="color: #4CAF50;">contact us</a>.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        }
    });
    
}


export async function createResetPasswordEmailTemplate(){

    const emailTemplateResetPasswordMail = await db.emailTemplate.create({
        data: {
            name: "reset-password",
            subject: "Reset Your Password",
            from: "onboarding@bsamaritan.com",
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset Password</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            color: #333333;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding: 10px 0;
                            background-color: #4CAF50;
                            color: #ffffff;
                            border-radius: 8px 8px 0 0;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content p {
                            font-size: 16px;
                            margin-bottom: 20px;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            font-size: 16px;
                            color: #ffffff;
                            background-color: #4CAF50;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                        .footer {
                            margin-top: 30px;
                            font-size: 12px;
                            color: #777777;
                            text-align: center;
                        }
                        .footer p {
                            margin: 0;
                        }

                        
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Reset your Password</h1>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>Please click the button below to reset your password:</p>
                            <a href="{{reset_password_link}}" class="button" style="color: white;">Reset Password</a>
                            <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
                            <p><a href="{{reset_password_link}}" style="color: #4CAF50;">{{reset_password_link}}</a></p>
                            <p>If you do want to reset the password, no further action is required.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Bayesian Labs. All rights reserved.</p>
                            <p>If you have any questions, feel free to <a href="mailto:support@bsamaritan.com" style="color: #4CAF50;">contact us</a>.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        }
    });
}