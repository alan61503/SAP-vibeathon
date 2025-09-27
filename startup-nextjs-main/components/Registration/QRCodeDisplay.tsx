"use client";

import { useState, useEffect } from 'react';
import { QRCodeData } from '@/lib/qr-code';

interface QRCodeDisplayProps {
  attendeeData?: {
    name: string;
    email: string;
    user_type: 'professional' | 'student';
  };
}

export default function QRCodeDisplay({ attendeeData }: QRCodeDisplayProps) {
  const [qrCodeData, setQrCodeData] = useState<QRCodeData | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get QR code data from localStorage
    const storedQRData = localStorage.getItem('qrCodeData');
    const storedQRImage = localStorage.getItem('qrCodeImage');

    if (storedQRData && storedQRImage) {
      try {
        const qrData = JSON.parse(storedQRData);
        setQrCodeData(qrData);
        setQrCodeImage(storedQRImage);
      } catch (error) {
        console.error('Error parsing QR code data:', error);
      }
    }
    setLoading(false);
  }, []);

  const downloadQRCode = () => {
    if (qrCodeImage) {
      const link = document.createElement('a');
      link.href = qrCodeImage;
      link.download = `vibeathon-qr-${attendeeData?.name || 'attendee'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const printQRCode = () => {
    if (qrCodeImage) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>VIBE QR Code - ${attendeeData?.name || 'Attendee'}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  padding: 20px;
                }
                .qr-container { 
                  margin: 20px 0; 
                }
                .qr-code { 
                  max-width: 300px; 
                  height: auto; 
                }
                .attendee-info {
                  margin: 20px 0;
                  font-size: 16px;
                }
              </style>
            </head>
            <body>
              <h1>SAP Vibeathon 2024</h1>
              <div class="attendee-info">
                <p><strong>Name:</strong> ${attendeeData?.name || 'N/A'}</p>
                <p><strong>Email:</strong> ${attendeeData?.email || 'N/A'}</p>
                <p><strong>Type:</strong> ${attendeeData?.user_type || 'N/A'}</p>
              </div>
              <div class="qr-container">
                <img src="${qrCodeImage}" alt="QR Code" class="qr-code" />
              </div>
              <p>Present this QR code at the event for check-in</p>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Generating your QR code...</p>
      </div>
    );
  }

  if (!qrCodeData || !qrCodeImage) {
    return (
      <div className="text-center">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            QR Code Not Available
          </h3>
          <p className="text-yellow-700 dark:text-yellow-300">
            QR code generation is in progress. Please refresh the page in a few moments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          🎉 Registration Successful!
        </h3>
        
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Your Event QR Code
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Present this QR code at the event for quick check-in
          </p>
          
          <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 mb-4">
            <img 
              src={qrCodeImage} 
              alt="Event QR Code" 
              className="mx-auto max-w-full h-auto"
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={downloadQRCode}
            className="w-full bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            📱 Download QR Code
          </button>
          
          <button
            onClick={printQRCode}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            🖨️ Print QR Code
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
            What's Next?
          </h5>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 text-left">
            <li>• Save this QR code to your phone</li>
            <li>• Bring a printed copy as backup</li>
            <li>• Check your email for confirmation</li>
            <li>• Arrive at the event with your QR code</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
