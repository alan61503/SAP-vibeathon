import { supabase } from './supabase';

export interface EmailConfirmationData {
  attendeeId: string;
  name: string;
  email: string;
  userType: 'professional' | 'student';
  registrationId: string;
  qrCode: string;
}

export const emailService = {
  // Send registration confirmation email
  async sendConfirmationEmail(data: EmailConfirmationData) {
    try {
      // Generate QR code for check-in
      const qrCodeUrl = await this.generateQRCode(data.registrationId);
      
      // Create email template
      const emailTemplate = this.createConfirmationTemplate(data, qrCodeUrl);
      
      // Send email using Supabase Edge Functions or external service
      const { data: emailData, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: data.email,
          subject: 'SAP Vibeathon - Registration Confirmation',
          html: emailTemplate.html,
          text: emailTemplate.text
        }
      });

      return { data: emailData, error };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { data: null, error };
    }
  },

  // Generate QR code for check-in
  async generateQRCode(registrationId: string): Promise<string> {
    // Use a QR code generation service or library
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(registrationId)}`;
    return qrCodeUrl;
  },

  // Create email template
  createConfirmationTemplate(data: EmailConfirmationData, qrCodeUrl: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>SAP Vibeathon - Registration Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4A6CF7; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .qr-code { text-align: center; margin: 20px 0; }
          .details { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to SAP Vibeathon!</h1>
            <p>Your registration has been confirmed</p>
          </div>
          
          <div class="content">
            <h2>Dear ${data.name},</h2>
            <p>Thank you for registering for SAP Vibeathon! We're excited to have you join us for this amazing event.</p>
            
            <div class="details">
              <h3>Registration Details</h3>
              <p><strong>Registration ID:</strong> ${data.registrationId}</p>
              <p><strong>Attendee Type:</strong> ${data.userType === 'professional' ? 'Professional' : 'Student'}</p>
              <p><strong>Email:</strong> ${data.email}</p>
            </div>
            
            <div class="qr-code">
              <h3>Your Check-in QR Code</h3>
              <img src="${qrCodeUrl}" alt="QR Code for check-in" style="border: 2px solid #4A6CF7; border-radius: 10px;">
              <p><em>Present this QR code at the venue for quick check-in</em></p>
            </div>
            
            <div class="details">
              <h3>Event Information</h3>
              <p><strong>Date:</strong> January 15, 2024</p>
              <p><strong>Time:</strong> 9:00 AM - 5:00 PM</p>
              <p><strong>Venue:</strong> SAP Innovation Center</p>
              <p><strong>Dress Code:</strong> Business Casual</p>
            </div>
            
            <div class="details">
              <h3>Next Steps</h3>
              <ul>
                <li>📅 <strong>Build Your Agenda:</strong> Visit our agenda page to select sessions you want to attend</li>
                <li>📱 <strong>Download the App:</strong> Get the latest updates and networking opportunities</li>
                <li>🤝 <strong>Network:</strong> Connect with other attendees before the event</li>
                <li>✅ <strong>Check-in:</strong> Use your QR code for quick venue check-in</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/agenda" 
                 style="background: #4A6CF7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                📅 View Event Agenda
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>We look forward to seeing you at SAP Vibeathon!</p>
            <p><strong>The VIBE Team</strong></p>
            <p>Questions? Contact us at support@vibeathon.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      SAP Vibeathon - Registration Confirmation
      
      Dear ${data.name},
      
      Thank you for registering for SAP Vibeathon! We're excited to have you join us.
      
      Registration Details:
      - Registration ID: ${data.registrationId}
      - Attendee Type: ${data.userType === 'professional' ? 'Professional' : 'Student'}
      - Email: ${data.email}
      
      Event Information:
      - Date: January 15, 2024
      - Time: 9:00 AM - 5:00 PM
      - Venue: SAP Innovation Center
      - Dress Code: Business Casual
      
      Next Steps:
      1. Build Your Agenda: Visit our agenda page to select sessions
      2. Download the App: Get the latest updates
      3. Network: Connect with other attendees
      4. Check-in: Use your QR code for quick venue check-in
      
      View Event Agenda: ${process.env.NEXT_PUBLIC_SITE_URL}/agenda
      
      We look forward to seeing you at SAP Vibeathon!
      
      The VIBE Team
      Questions? Contact us at support@vibeathon.com
    `;

    return { html, text };
  },

  // Send WhatsApp notification (optional)
  async sendWhatsAppNotification(phoneNumber: string, message: string) {
    try {
      // This would integrate with WhatsApp Business API
      // For now, we'll simulate the API call
      const { data, error } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          to: phoneNumber,
          message: message
        }
      });

      return { data, error };
    } catch (error) {
      console.error('WhatsApp notification failed:', error);
      return { data: null, error };
    }
  }
};
