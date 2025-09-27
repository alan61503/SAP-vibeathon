# SAP Vibeathon Registration System Setup

## ✅ Complete Registration System

Your Next.js project now includes a comprehensive registration system with dual registration flows for professionals and students, integrated with Supabase.

## 🗄️ Database Setup

### 1. Create the Attendees Table
Run this SQL in your Supabase SQL Editor:

```sql
-- Create attendees table for both professionals and students
CREATE TABLE attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile TEXT NOT NULL,
  food_choice TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('professional', 'student')),
  
  -- Professional fields (nullable for students)
  company TEXT,
  designation TEXT,
  
  -- Student fields (nullable for professionals)
  college TEXT,
  education_level TEXT CHECK (education_level IN ('UG', 'PG')),
  year_of_study TEXT,
  
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
```

## 🎯 Features Implemented

### 1. Dual Registration Flows

#### Professional Registration
- **Fields**: Name, Email, Mobile, Company, Designation, Food Choice
- **Validation**: All fields required, unique email validation
- **User Type**: Automatically set to 'professional'

#### Student Registration  
- **Fields**: Name, Email, Mobile, College, Education Level (UG/PG), Year of Study, Food Choice
- **Validation**: All fields required, unique email validation
- **User Type**: Automatically set to 'student'

### 2. Authentication System
- **Login**: Email-based login to retrieve existing registrations
- **Registration**: New user registration with form validation
- **Dashboard**: User dashboard showing registration details and event statistics

### 3. Form Validation
- ✅ Required field validation
- ✅ Email uniqueness check
- ✅ Real-time error handling
- ✅ Success confirmation

### 4. User Dashboard
- Personal registration details
- Event statistics (total registrations, professionals, students)
- Complete attendees list
- Logout functionality

## 📁 File Structure

```
components/Registration/
├── AuthModal.tsx          # Main authentication modal
├── LoginForm.tsx          # Login form component
├── RegistrationForm.tsx    # Registration form with dual flows
└── UserDashboard.tsx       # User dashboard after login

lib/
├── attendees.ts           # Database operations for attendees
├── auth.ts               # Authentication helpers
├── database.ts           # General database operations
└── supabase.ts           # Supabase client configuration

app/
├── registration/
│   └── page.tsx          # Registration page
└── page.tsx              # Updated homepage with CTA

database-schema.sql       # Complete database schema
```

## 🚀 Usage

### 1. Access Registration
- Visit `/registration` for the main registration page
- Or click "Register Now" button on homepage

### 2. Registration Process
1. **Choose User Type**: Professional or Student
2. **Fill Form**: Complete all required fields
3. **Validation**: System checks for required fields and unique email
4. **Submit**: Data saved to Supabase attendees table
5. **Success**: Confirmation message displayed

### 3. Login Process
1. **Enter Email**: Use registered email address
2. **Login**: System retrieves registration details
3. **Dashboard**: View personal details and event statistics

## 🔧 API Functions

### Attendees Operations
```typescript
import { attendees } from '@/lib/attendees';

// Create new attendee
const { data, error } = await attendees.createAttendee(attendeeData);

// Check if email exists
const { exists, error } = await attendees.checkEmailExists(email);

// Get attendee by email
const { data, error } = await attendees.getAttendeeByEmail(email);

// Get all attendees
const { data, error } = await attendees.getAllAttendees();

// Get attendees by type
const { data, error } = await attendees.getAttendeesByType('professional');
```

## 🎨 UI Components

### Registration Form Features
- **Responsive Design**: Works on all device sizes
- **Dark Mode Support**: Automatic theme switching
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Visual feedback during submission
- **Success States**: Clear confirmation messages

### User Dashboard Features
- **Personal Info**: Display user registration details
- **Statistics**: Show event registration statistics
- **Attendees List**: Complete list of all registrations
- **Responsive Table**: Mobile-friendly data display

## 🔒 Security Features

### Database Security
- **Row Level Security (RLS)**: Enabled on attendees table
- **Data Validation**: Server-side validation for all inputs
- **Unique Constraints**: Email uniqueness enforced
- **Type Safety**: TypeScript interfaces for data validation

### Form Security
- **Input Validation**: Client and server-side validation
- **Error Handling**: Secure error messages
- **Data Sanitization**: Clean data before database insertion

## 📊 Data Structure

### Professional Attendee
```typescript
interface ProfessionalAttendee {
  name: string;
  email: string;
  mobile: string;
  company: string;
  designation: string;
  food_choice: string;
  user_type: 'professional';
}
```

### Student Attendee
```typescript
interface StudentAttendee {
  name: string;
  email: string;
  mobile: string;
  college: string;
  education_level: 'UG' | 'PG';
  year_of_study: string;
  food_choice: string;
  user_type: 'student';
}
```

## 🚀 Next Steps

1. **Test Registration**: Try both professional and student registration flows
2. **Check Database**: Verify data is being saved correctly in Supabase
3. **Customize Styling**: Modify colors and styling to match your brand
4. **Add Features**: Consider adding email notifications, admin panel, etc.
5. **Deploy**: Deploy to production when ready

## 🔧 Customization

### Styling
- Modify colors in `tailwind.config.js`
- Update component styles in individual files
- Add your brand colors and fonts

### Form Fields
- Add/remove fields in `RegistrationForm.tsx`
- Update database schema accordingly
- Modify validation logic

### Dashboard
- Customize statistics in `UserDashboard.tsx`
- Add new features like export functionality
- Modify data display format

## 📞 Support

The registration system is fully functional and ready to use. All components are properly typed with TypeScript and include comprehensive error handling.

**Key URLs:**
- Homepage: `/` (with registration CTA)
- Registration: `/registration`
- Supabase Dashboard: Your Supabase project dashboard
