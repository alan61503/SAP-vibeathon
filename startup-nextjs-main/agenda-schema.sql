-- Create event sessions table
CREATE TABLE event_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  speaker TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('keynote', 'workshop', 'panel', 'networking', 'break')),
  track TEXT CHECK (track IN ('technical', 'business', 'general')),
  max_capacity INTEGER,
  current_attendees INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create personalized agenda table
CREATE TABLE personalized_agenda (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attendee_id UUID REFERENCES attendees(id) ON DELETE CASCADE,
  session_id UUID REFERENCES event_sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(attendee_id, session_id)
);

-- Enable Row Level Security
ALTER TABLE event_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalized_agenda ENABLE ROW LEVEL SECURITY;

-- Create policies for event_sessions
CREATE POLICY "Anyone can view event sessions" ON event_sessions FOR SELECT USING (true);

-- Create policies for personalized_agenda
CREATE POLICY "Users can view their own agenda" ON personalized_agenda FOR SELECT USING (true);
CREATE POLICY "Users can add to their agenda" ON personalized_agenda FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can remove from their agenda" ON personalized_agenda FOR DELETE USING (true);

-- Create indexes
CREATE INDEX idx_event_sessions_start_time ON event_sessions(start_time);
CREATE INDEX idx_event_sessions_category ON event_sessions(category);
CREATE INDEX idx_personalized_agenda_attendee ON personalized_agenda(attendee_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for event_sessions
CREATE TRIGGER update_event_sessions_updated_at 
    BEFORE UPDATE ON event_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample event sessions
INSERT INTO event_sessions (title, description, start_time, end_time, location, speaker, category, track) VALUES
('Welcome & Opening Keynote', 'Opening keynote by SAP leadership team', '2024-01-15 09:00:00+00', '2024-01-15 10:00:00+00', 'Main Hall', 'SAP Leadership', 'keynote', 'general'),
('SAP Technology Trends', 'Latest trends in SAP technology and innovation', '2024-01-15 10:30:00+00', '2024-01-15 11:30:00+00', 'Tech Hall', 'Dr. Sarah Johnson', 'workshop', 'technical'),
('Networking Break', 'Coffee and networking session', '2024-01-15 11:30:00+00', '2024-01-15 12:00:00+00', 'Lobby', 'All', 'break', 'general'),
('Business Innovation Panel', 'Panel discussion on business innovation with SAP', '2024-01-15 12:00:00+00', '2024-01-15 13:00:00+00', 'Business Hall', 'Panel of Experts', 'panel', 'business'),
('Lunch Break', 'Lunch and networking', '2024-01-15 13:00:00+00', '2024-01-15 14:00:00+00', 'Dining Hall', 'All', 'break', 'general'),
('Hands-on SAP Workshop', 'Interactive workshop on SAP development', '2024-01-15 14:00:00+00', '2024-01-15 15:30:00+00', 'Workshop Room 1', 'Tech Experts', 'workshop', 'technical'),
('Career Development Session', 'Career opportunities in SAP ecosystem', '2024-01-15 15:30:00+00', '2024-01-15 16:30:00+00', 'Career Hall', 'HR Team', 'workshop', 'business'),
('Closing Ceremony', 'Event wrap-up and next steps', '2024-01-15 16:30:00+00', '2024-01-15 17:00:00+00', 'Main Hall', 'Event Organizers', 'keynote', 'general');
