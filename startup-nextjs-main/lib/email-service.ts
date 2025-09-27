import { QRCodeData } from './qr-code';

export interface EmailData {
  to: string;
  name: string;
  userType: 'professional' | 'student';
  qrCodeDataURL?: string;
  eventDetails: {
    name: string;
    date: string;
    time: string;
    location: string;
    description: string;
  };
}

export class EmailService {
  /**
   * Send confirmation email with QR code
   */
  static async sendConfirmationEmail(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      // In a real implementation, you would use an email service like:
      // - SendGrid
      // - AWS SES
      // - Nodemailer with SMTP
      // - Resend
      
      // For now, we'll simulate the email sending
      console.log('Sending confirmation email to:', emailData.to);
      console.log('Email data:', {
        to: emailData.to,
        name: emailData.name,
        userType: emailData.userType,
        hasQRCode: !!emailData.qrCodeDataURL,
        eventName: emailData.eventDetails.name
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real implementation, you would:
      // 1. Generate HTML email template
      // 2. Embed QR code image
      // 3. Send via email service
      // 4. Handle errors and retries

      return { success: true };
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      };
    }
  }

  /**
   * Generate HTML email template
   */
  static generateEmailHTML(emailData: EmailData): string {
    const { name, userType, qrCodeDataURL, eventDetails } = emailData;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>SAP Vibeathon 2024 - Registration Confirmation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #4A6CF7, #6B73FF);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .qr-section {
              text-align: center;
              margin: 30px 0;
              padding: 20px;
              background: white;
              border-radius: 10px;
              border: 2px dashed #4A6CF7;
            }
            .qr-code {
              max-width: 200px;
              height: auto;
              margin: 20px 0;
            }
            .event-details {
              background: white;
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background: #4A6CF7;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin: 10px 5px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Welcome to SAP Vibeathon 2024!</h1>
            <p>Your registration has been confirmed</p>
          </div>
          
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Thank you for registering for SAP Vibeathon 2024 as a <strong>${userType}</strong>. We're excited to have you join us for this amazing event!</p>
            
            ${qrCodeDataURL ? `
              <div class="qr-section">
                <h3>📱 Your Event QR Code</h3>
                <p>Present this QR code at the event for quick check-in:</p>
                <img src="${qrCodeDataURL}" alt="Event QR Code" class="qr-code" />
                <p><strong>Save this QR code to your phone or print it out!</strong></p>
              </div>
            ` : ''}
            
            <div class="event-details">
              <h3>📅 Event Details</h3>
              <p><strong>Event:</strong> ${eventDetails.name}</p>
              <p><strong>Date:</strong> ${eventDetails.date}</p>
              <p><strong>Time:</strong> ${eventDetails.time}</p>
              <p><strong>Location:</strong> ${eventDetails.location}</p>
              <p><strong>Description:</strong> ${eventDetails.description}</p>
            </div>
            
            <h3>What's Next?</h3>
            <ul>
              <li>Save your QR code to your phone</li>
              <li>Bring a printed copy as backup</li>
              <li>Arrive 15 minutes early for check-in</li>
              <li>Follow us on social media for updates</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" class="button">View Event Details</a>
              <a href="#" class="button">Download QR Code</a>
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>For support, contact us at support@sapvibeathon.com</p>
            <p>&copy; 2024 SAP Vibeathon. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate plain text email
   */
  static generateEmailText(emailData: EmailData): string {
    const { name, userType, eventDetails } = emailData;
    
    return `
SAP Vibeathon 2024 - Registration Confirmation

Hello ${name}!

Thank you for registering for SAP Vibeathon 2024 as a ${userType}. We're excited to have you join us for this amazing event!

Event Details:
- Event: ${eventDetails.name}
- Date: ${eventDetails.date}
- Time: ${eventDetails.time}
- Location: ${eventDetails.location}
- Description: ${eventDetails.description}

What's Next?
- Save your QR code to your phone
- Bring a printed copy as backup
- Arrive 15 minutes early for check-in
- Follow us on social media for updates

For support, contact us at support@sapvibeathon.com

© 2024 SAP Vibeathon. All rights reserved.
    `.trim();
  }
}
