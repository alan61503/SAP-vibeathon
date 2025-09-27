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

-- Insert comprehensive sample event sessions for SAP Vibeathon
INSERT INTO event_sessions (title, description, start_time, end_time, location, speaker, category, track, max_capacity) VALUES
-- Day 1 Sessions
('Welcome & Opening Keynote', 'Join us for an inspiring opening keynote by SAP leadership team. Discover the future of technology and innovation in the SAP ecosystem.', '2024-01-15 09:00:00+00', '2024-01-15 10:00:00+00', 'Main Hall', 'SAP Leadership Team', 'keynote', 'general', 500),
('SAP Technology Trends 2024', 'Explore the latest trends in SAP technology, including cloud computing, AI/ML integration, and modern development practices.', '2024-01-15 10:30:00+00', '2024-01-15 11:30:00+00', 'Tech Hall A', 'Dr. Sarah Johnson, SAP CTO', 'workshop', 'technical', 150),
('Networking & Coffee Break', 'Connect with fellow attendees, speakers, and SAP experts over coffee and light refreshments.', '2024-01-15 11:30:00+00', '2024-01-15 12:00:00+00', 'Lobby & Networking Area', 'All Attendees', 'networking', 'general', 1000),
('Business Innovation Panel', 'Panel discussion featuring industry leaders on how SAP solutions drive business innovation and digital transformation.', '2024-01-15 12:00:00+00', '2024-01-15 13:00:00+00', 'Business Hall', 'Panel: 5 Industry Experts', 'panel', 'business', 200),
('Lunch & Networking', 'Enjoy lunch while networking with peers, mentors, and potential collaborators.', '2024-01-15 13:00:00+00', '2024-01-15 14:00:00+00', 'Dining Hall', 'All Attendees', 'break', 'general', 1000),
('Hands-on SAP Development Workshop', 'Interactive workshop covering SAP development tools, best practices, and hands-on coding exercises.', '2024-01-15 14:00:00+00', '2024-01-15 15:30:00+00', 'Workshop Room 1', 'SAP Development Team', 'workshop', 'technical', 50),
('Career Development in SAP Ecosystem', 'Learn about career opportunities, skill development, and growth paths in the SAP ecosystem.', '2024-01-15 15:30:00+00', '2024-01-15 16:30:00+00', 'Career Hall', 'SAP HR & Talent Team', 'workshop', 'business', 100),
('Closing Ceremony & Next Steps', 'Event wrap-up, key takeaways, and information about ongoing opportunities and resources.', '2024-01-15 16:30:00+00', '2024-01-15 17:00:00+00', 'Main Hall', 'Event Organizers', 'keynote', 'general', 500),

-- Additional Technical Sessions
('SAP Cloud Platform Deep Dive', 'Comprehensive session on SAP Cloud Platform capabilities, services, and implementation strategies.', '2024-01-15 10:30:00+00', '2024-01-15 11:30:00+00', 'Tech Hall B', 'Cloud Platform Team', 'workshop', 'technical', 80),
('AI & Machine Learning with SAP', 'Explore how to integrate AI and ML capabilities into SAP applications and business processes.', '2024-01-15 14:00:00+00', '2024-01-15 15:30:00+00', 'Workshop Room 2', 'AI/ML Specialists', 'workshop', 'technical', 60),
('SAP Integration & APIs', 'Learn about modern integration patterns, APIs, and connecting SAP with other systems.', '2024-01-15 15:30:00+00', '2024-01-15 16:30:00+00', 'Tech Hall C', 'Integration Experts', 'workshop', 'technical', 70),

-- Business & Strategy Sessions
('Digital Transformation Strategies', 'Case studies and best practices for digital transformation using SAP solutions.', '2024-01-15 12:00:00+00', '2024-01-15 13:00:00+00', 'Business Hall B', 'Digital Strategy Team', 'panel', 'business', 120),
('SAP for Startups & SMEs', 'How small and medium enterprises can leverage SAP solutions for growth and efficiency.', '2024-01-15 14:00:00+00', '2024-01-15 15:30:00+00', 'Business Hall C', 'SME Solutions Team', 'workshop', 'business', 90),
('Industry 4.0 & Smart Manufacturing', 'Explore how SAP enables smart manufacturing and Industry 4.0 initiatives.', '2024-01-15 15:30:00+00', '2024-01-15 16:30:00+00', 'Business Hall D', 'Manufacturing Experts', 'workshop', 'business', 80),

-- Student-Focused Sessions
('Student Career Paths in Tech', 'Panel discussion with recent graduates and industry professionals about career paths in technology.', '2024-01-15 12:00:00+00', '2024-01-15 13:00:00+00', 'Student Hall', 'Recent Graduates Panel', 'panel', 'general', 150),
('Internship & Job Opportunities', 'Learn about internship programs, entry-level positions, and how to prepare for SAP careers.', '2024-01-15 14:00:00+00', '2024-01-15 15:30:00+00', 'Career Center', 'SAP Talent Acquisition', 'workshop', 'business', 100),
('Building Your Tech Portfolio', 'Workshop on creating a strong portfolio, GitHub presence, and showcasing your technical skills.', '2024-01-15 15:30:00+00', '2024-01-15 16:30:00+00', 'Student Workshop Room', 'Tech Mentors', 'workshop', 'technical', 60);
