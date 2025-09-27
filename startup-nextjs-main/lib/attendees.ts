import { supabase } from './supabase';
import { QRCodeService, QRCodeData } from './qr-code';

export interface ProfessionalAttendee {
  name: string;
  email: string;
  mobile: string;
  company: string;
  designation: string;
  food_choice: 'Veg' | 'Non-Veg';
  user_type: 'professional';
  country?: string;
  gender?: string;
  blood_group?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  consent_notifications: boolean;
}

export interface StudentAttendee {
  name: string;
  email: string;
  mobile: string;
  college: string;
  education_level: 'UG' | 'PG';
  year_of_study: string;
  food_choice: 'Veg' | 'Non-Veg';
  user_type: 'student';
  country?: string;
  gender?: string;
  blood_group?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  consent_notifications: boolean;
}

export type Attendee = ProfessionalAttendee | StudentAttendee;

export const attendees = {
  // Create a new attendee
  async createAttendee(attendeeData: Attendee) {
    const { data, error } = await supabase
      .from('attendees')
      .insert([attendeeData])
      .select();
    return { data, error };
  },

  // Get all attendees
  async getAllAttendees() {
    const { data, error } = await supabase
      .from('attendees')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Get attendees by type
  async getAttendeesByType(userType: 'professional' | 'student') {
    const { data, error } = await supabase
      .from('attendees')
      .select('*')
      .eq('user_type', userType)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Check if email exists
  async checkEmailExists(email: string) {
    const { data, error } = await supabase
      .from('attendees')
      .select('email')
      .eq('email', email)
      .single();
    
    return { exists: !!data, error };
  },

  // Get attendee by email
  async getAttendeeByEmail(email: string) {
    const { data, error } = await supabase
      .from('attendees')
      .select('*')
      .eq('email', email)
      .single();
    return { data, error };
  },

  // Update attendee
  async updateAttendee(id: string, updates: Partial<Attendee>) {
    const { data, error } = await supabase
      .from('attendees')
      .update(updates)
      .eq('id', id)
      .select();
    return { data, error };
  },

  // Delete attendee
  async deleteAttendee(id: string) {
    const { data, error } = await supabase
      .from('attendees')
      .delete()
      .eq('id', id);
    return { data, error };
  },

  // Check-in attendee
  async checkInAttendee(id: string) {
    const { data, error } = await supabase
      .from('attendees')
      .update({
        checked_in: true,
        check_in_time: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    return { data, error };
  },

  // Get checked-in attendees
  async getCheckedInAttendees() {
    const { data, error } = await supabase
      .from('attendees')
      .select('*')
      .eq('checked_in', true)
      .order('check_in_time', { ascending: false });
    return { data, error };
  },

  // Get check-in statistics
  async getCheckInStats() {
    const { data: total, error: totalError } = await supabase
      .from('attendees')
      .select('id', { count: 'exact' });

    const { data: checkedIn, error: checkedInError } = await supabase
      .from('attendees')
      .select('id', { count: 'exact' })
      .eq('checked_in', true);

    if (totalError || checkedInError) {
      return { data: null, error: totalError || checkedInError };
    }

    return {
      data: {
        total: total?.length || 0,
        checkedIn: checkedIn?.length || 0,
        pending: (total?.length || 0) - (checkedIn?.length || 0)
      },
      error: null
    };
  },

  // Generate QR code for an attendee
  async generateQRCode(attendeeId: string): Promise<{ data: QRCodeData & { qrCodeDataURL: string }; error: any }> {
    try {
      const { data: attendee, error: fetchError } = await supabase
        .from('attendees')
        .select('*')
        .eq('id', attendeeId)
        .single();

      if (fetchError || !attendee) {
        return { data: null as any, error: fetchError || new Error('Attendee not found') };
      }

      const qrData = QRCodeService.generateQRData(attendee);
      const qrCodeDataURL = await QRCodeService.generateQRCode(qrData);

      // Update attendee record with QR code data
      const { error: updateError } = await supabase
        .from('attendees')
        .update({
          qr_code_data: qrData,
          qr_code_generated_at: new Date().toISOString()
        })
        .eq('id', attendeeId);

      if (updateError) {
        console.error('Error updating QR code data:', updateError);
      }

      return { data: { ...qrData, qrCodeDataURL }, error: null };
    } catch (error) {
      return { data: null as any, error };
    }
  },

  // Check-in attendee using QR code
  async checkInWithQR(qrCodeData: QRCodeData): Promise<{ success: boolean; error: any }> {
    try {
      // Validate QR code data
      if (!QRCodeService.validateQRCodeData(qrCodeData)) {
        return { success: false, error: new Error('Invalid QR code data') };
      }

      // Check if attendee exists
      const { data: attendee, error: fetchError } = await supabase
        .from('attendees')
        .select('*')
        .eq('id', qrCodeData.attendeeId)
        .single();

      if (fetchError || !attendee) {
        return { success: false, error: new Error('Attendee not found') };
      }

      // Check if already checked in
      if (attendee.checked_in) {
        return { success: false, error: new Error('Attendee already checked in') };
      }

      // Update check-in status
      const { error: updateError } = await supabase
        .from('attendees')
        .update({
          checked_in: true,
          check_in_time: new Date().toISOString()
        })
        .eq('id', qrCodeData.attendeeId);

      if (updateError) {
        return { success: false, error: updateError };
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  },

  // Get attendee by ID
  async getAttendeeById(attendeeId: string): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .eq('id', attendeeId)
        .single();

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }
};
