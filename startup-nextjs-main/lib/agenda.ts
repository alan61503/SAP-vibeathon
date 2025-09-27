import { supabase } from './supabase';

export interface EventSession {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  speaker: string;
  category: 'keynote' | 'workshop' | 'panel' | 'networking' | 'break';
  track?: 'technical' | 'business' | 'general';
  max_capacity?: number;
  current_attendees?: number;
}

export interface PersonalizedAgenda {
  id: string;
  attendee_id: string;
  session_id: string;
  created_at: string;
  session?: EventSession;
}

export const agenda = {
  // Get all event sessions
  async getAllSessions() {
    const { data, error } = await supabase
      .from('event_sessions')
      .select('*')
      .order('start_time', { ascending: true });
    return { data, error };
  },

  // Get sessions by category
  async getSessionsByCategory(category: string) {
    const { data, error } = await supabase
      .from('event_sessions')
      .select('*')
      .eq('category', category)
      .order('start_time', { ascending: true });
    return { data, error };
  },

  // Get personalized agenda for attendee
  async getPersonalizedAgenda(attendeeId: string) {
    const { data, error } = await supabase
      .from('personalized_agenda')
      .select(`
        *,
        event_sessions (*)
      `)
      .eq('attendee_id', attendeeId)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  // Add session to personalized agenda
  async addToAgenda(attendeeId: string, sessionId: string) {
    const { data, error } = await supabase
      .from('personalized_agenda')
      .insert([
        {
          attendee_id: attendeeId,
          session_id: sessionId
        }
      ])
      .select();
    return { data, error };
  },

  // Remove session from personalized agenda
  async removeFromAgenda(attendeeId: string, sessionId: string) {
    const { data, error } = await supabase
      .from('personalized_agenda')
      .delete()
      .eq('attendee_id', attendeeId)
      .eq('session_id', sessionId);
    return { data, error };
  },

  // Check if session is in agenda
  async isInAgenda(attendeeId: string, sessionId: string) {
    const { data, error } = await supabase
      .from('personalized_agenda')
      .select('id')
      .eq('attendee_id', attendeeId)
      .eq('session_id', sessionId)
      .single();
    
    return { isInAgenda: !!data, error };
  },

  // Get agenda statistics
  async getAgendaStats(attendeeId: string) {
    const { data, error } = await supabase
      .from('personalized_agenda')
      .select('id', { count: 'exact' })
      .eq('attendee_id', attendeeId);
    
    return { count: data?.length || 0, error };
  }
};
