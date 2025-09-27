import { supabase } from './supabase';

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
  }
};
