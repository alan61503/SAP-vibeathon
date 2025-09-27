"use client";

import { useState, useRef, useEffect } from 'react';
import { QRCodeService, QRCodeData } from '@/lib/qr-code';
import { attendees } from '@/lib/attendees';

interface QRCodeScannerProps {
  onCheckInSuccess: (attendeeData: any) => void;
  onCheckInError: (error: string) => void;
}

export default function QRCodeScanner({ onCheckInSuccess, onCheckInError }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<QRCodeData | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      onCheckInError('Camera access denied. Please allow camera access to scan QR codes.');
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        // Here you would typically use a QR code detection library
        // For now, we'll simulate QR code detection
        return canvas.toDataURL();
      }
    }
    return null;
  };

  const handleQRCodeDetected = async (qrData: QRCodeData) => {
    setScannedData(qrData);
    setCheckingIn(true);
    
    try {
      const { success, error } = await attendees.checkInWithQR(qrData);
      
      if (success) {
        // Get attendee details
        const { data: attendeeData } = await attendees.getAttendeeById(qrData.attendeeId);
        onCheckInSuccess(attendeeData);
        stopScanning();
      } else {
        onCheckInError(error?.message || 'Check-in failed');
      }
    } catch (error) {
      onCheckInError('An unexpected error occurred during check-in');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleManualQRInput = (qrText: string) => {
    try {
      const qrData = QRCodeService.parseQRCodeData(qrText);
      if (qrData) {
        handleQRCodeDetected(qrData);
      } else {
        onCheckInError('Invalid QR code format');
      }
    } catch (error) {
      onCheckInError('Invalid QR code data');
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          QR Code Scanner
        </h3>
        
        {!isScanning ? (
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <button
              onClick={startScanning}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              📱 Start Scanning
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg"
              />
              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={stopScanning}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Stop Scanning
              </button>
            </div>
          </div>
        )}

        {/* Manual QR Code Input */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Manual QR Code Input
          </h4>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Paste QR code data here..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  if (target.value.trim()) {
                    handleManualQRInput(target.value.trim());
                    target.value = '';
                  }
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                if (input.value.trim()) {
                  handleManualQRInput(input.value.trim());
                  input.value = '';
                }
              }}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Check In
            </button>
          </div>
        </div>

        {checkingIn && (
          <div className="mt-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Processing check-in...</p>
          </div>
        )}

        {scannedData && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
              Scanned Attendee
            </h5>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {scannedData.name} ({scannedData.email})
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
