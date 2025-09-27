import QRCode from 'qrcode';

export interface QRCodeData {
  attendeeId: string;
  email: string;
  name: string;
  userType: 'professional' | 'student';
  eventId: string;
  timestamp: number;
}

export class QRCodeService {
  /**
   * Generate QR code data for an attendee
   */
  static generateQRData(attendee: {
    id: string;
    email: string;
    name: string;
    user_type: 'professional' | 'student';
  }): QRCodeData {
    return {
      attendeeId: attendee.id,
      email: attendee.email,
      name: attendee.name,
      userType: attendee.user_type,
      eventId: 'sap-vibeathon-2024', // You can make this dynamic
      timestamp: Date.now()
    };
  }

  /**
   * Generate QR code as data URL
   */
  static async generateQRCode(data: QRCodeData): Promise<string> {
    try {
      const qrDataString = JSON.stringify(data);
      const qrCodeDataURL = await QRCode.toDataURL(qrDataString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Generate QR code as SVG
   */
  static async generateQRCodeSVG(data: QRCodeData): Promise<string> {
    try {
      const qrDataString = JSON.stringify(data);
      const qrCodeSVG = await QRCode.toString(qrDataString, {
        type: 'svg',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      return qrCodeSVG;
    } catch (error) {
      console.error('Error generating QR code SVG:', error);
      throw new Error('Failed to generate QR code SVG');
    }
  }

  /**
   * Parse QR code data from scanned content
   */
  static parseQRCodeData(qrContent: string): QRCodeData | null {
    try {
      const data = JSON.parse(qrContent);
      
      // Validate required fields
      if (!data.attendeeId || !data.email || !data.name || !data.userType) {
        return null;
      }

      return data as QRCodeData;
    } catch (error) {
      console.error('Error parsing QR code data:', error);
      return null;
    }
  }

  /**
   * Validate QR code data
   */
  static validateQRCodeData(data: QRCodeData): boolean {
    return !!(
      data.attendeeId &&
      data.email &&
      data.name &&
      data.userType &&
      data.eventId &&
      data.timestamp
    );
  }
}
