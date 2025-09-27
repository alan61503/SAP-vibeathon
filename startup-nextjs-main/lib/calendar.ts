import { EventSession } from './agenda';

export interface CalendarEvent {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  attendees?: string[];
}

export const calendarService = {
  // Generate Google Calendar URL
  generateGoogleCalendarUrl(session: EventSession): string {
    const startTime = new Date(session.start_time).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endTime = new Date(session.end_time).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: session.title,
      dates: `${startTime}/${endTime}`,
      details: session.description,
      location: session.location,
      trp: 'false'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  },

  // Generate Outlook Calendar URL
  generateOutlookCalendarUrl(session: EventSession): string {
    const startTime = new Date(session.start_time).toISOString();
    const endTime = new Date(session.end_time).toISOString();
    
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: session.title,
      startdt: startTime,
      enddt: endTime,
      body: session.description,
      location: session.location
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  },

  // Generate ICS file for download
  generateICSFile(session: EventSession): string {
    const startTime = new Date(session.start_time).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endTime = new Date(session.end_time).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SAP Vibeathon//Event Session//EN
BEGIN:VEVENT
UID:${session.id}@vibeathon.com
DTSTAMP:${now}
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${session.title}
DESCRIPTION:${session.description}
LOCATION:${session.location}
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT
END:VCALENDAR`;
  },

  // Download ICS file
  downloadICSFile(session: EventSession): void {
    const icsContent = this.generateICSFile(session);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Add session to calendar (with provider selection)
  async addToCalendar(session: EventSession, provider: 'google' | 'outlook' | 'ics'): Promise<void> {
    switch (provider) {
      case 'google':
        window.open(this.generateGoogleCalendarUrl(session), '_blank');
        break;
      case 'outlook':
        window.open(this.generateOutlookCalendarUrl(session), '_blank');
        break;
      case 'ics':
        this.downloadICSFile(session);
        break;
    }
  },

  // Add multiple sessions to calendar
  async addMultipleToCalendar(sessions: EventSession[], provider: 'google' | 'outlook' | 'ics'): Promise<void> {
    if (provider === 'ics') {
      // For ICS, we'll create a combined file
      const combinedICS = this.generateCombinedICSFile(sessions);
      const blob = new Blob([combinedICS], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sap_vibeathon_agenda.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // For Google/Outlook, we'll add them one by one
      for (const session of sessions) {
        await this.addToCalendar(session, provider);
        // Small delay to prevent browser blocking
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  },

  // Generate combined ICS file for multiple sessions
  generateCombinedICSFile(sessions: EventSession[]): string {
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SAP Vibeathon//Event Agenda//EN`;

    sessions.forEach(session => {
      const startTime = new Date(session.start_time).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const endTime = new Date(session.end_time).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      icsContent += `
BEGIN:VEVENT
UID:${session.id}@vibeathon.com
DTSTAMP:${now}
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${session.title}
DESCRIPTION:${session.description}
LOCATION:${session.location}
STATUS:CONFIRMED
TRANSP:OPAQUE
END:VEVENT`;
    });

    icsContent += `
END:VCALENDAR`;

    return icsContent;
  }
};
