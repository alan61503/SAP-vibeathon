-- Create attendees table for both professionals and students
CREATE TABLE attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile TEXT NOT NULL,
  food_choice TEXT NOT NULL CHECK (food_choice IN ('Veg', 'Non-Veg')),
  user_type TEXT NOT NULL CHECK (user_type IN ('professional', 'student')),
  
  -- Professional fields (nullable for students)
  company TEXT,
  designation TEXT,
  
  -- Student fields (nullable for professionals)
  college TEXT,
  education_level TEXT CHECK (education_level IN ('UG', 'PG')),
  year_of_study TEXT,
  
  -- Common additional fields
  country TEXT,
  gender TEXT,
  blood_group TEXT,
  emergency_contact_name TEXT,
  emergency_contact_number TEXT,
  consent_notifications BOOLEAN DEFAULT FALSE,
  
  -- Check-in fields
  checked_in BOOLEAN DEFAULT FALSE,
  check_in_time TIMESTAMP WITH TIME ZONE,
  
  -- Common fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert attendees" ON attendees FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view attendees" ON attendees FOR SELECT USING (true);
CREATE POLICY "Anyone can update attendees" ON attendees FOR UPDATE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_attendees_email ON attendees(email);
CREATE INDEX idx_attendees_user_type ON attendees(user_type);
CREATE INDEX idx_attendees_created_at ON attendees(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_attendees_updated_at 
    BEFORE UPDATE ON attendees 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
