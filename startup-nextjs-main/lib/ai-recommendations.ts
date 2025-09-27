import { EventSession } from './agenda';

export interface AttendeeProfile {
  userType: 'professional' | 'student';
  company?: string;
  designation?: string;
  college?: string;
  educationLevel?: 'UG' | 'PG';
  interests?: string[];
  tools?: string[];
}

export interface RecommendationEngine {
  // Get AI-based session recommendations
  getRecommendations(profile: AttendeeProfile, allSessions: EventSession[]): EventSession[];
  
  // Check for session conflicts
  checkConflicts(selectedSessions: EventSession[]): { hasConflicts: boolean; conflicts: string[] };
  
  // Get personalized agenda suggestions
  getPersonalizedAgenda(profile: AttendeeProfile, allSessions: EventSession[]): EventSession[];
}

export const aiRecommendations: RecommendationEngine = {
  // Get AI-based session recommendations
  getRecommendations(profile: AttendeeProfile, allSessions: EventSession[]): EventSession[] {
    const recommendations: EventSession[] = [];
    const scoredSessions = allSessions.map(session => ({
      session,
      score: this.calculateSessionScore(session, profile)
    }));

    // Sort by score and return top recommendations
    scoredSessions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5) // Top 5 recommendations
      .forEach(item => recommendations.push(item.session));

    return recommendations;
  },

  // Calculate session relevance score
  calculateSessionScore(session: EventSession, profile: AttendeeProfile): number {
    let score = 0;

    // Base score for all sessions
    score += 10;

    // Track-based scoring
    if (session.track) {
      if (profile.userType === 'professional') {
        if (session.track === 'business') score += 20;
        if (session.track === 'technical') score += 15;
      } else {
        if (session.track === 'technical') score += 20;
        if (session.track === 'business') score += 10;
      }
    }

    // Category-based scoring
    switch (session.category) {
      case 'keynote':
        score += 25; // Keynotes are important for everyone
        break;
      case 'workshop':
        if (profile.userType === 'student') score += 20;
        else score += 15;
        break;
      case 'panel':
        if (profile.userType === 'professional') score += 18;
        else score += 12;
        break;
      case 'networking':
        score += 15; // Networking is valuable for all
        break;
      case 'break':
        score += 5; // Breaks are necessary but low priority
        break;
    }

    // Time-based scoring (prefer morning sessions)
    const sessionHour = new Date(session.start_time).getHours();
    if (sessionHour >= 9 && sessionHour <= 11) score += 10;
    if (sessionHour >= 14 && sessionHour <= 16) score += 8;

    // Interest-based scoring
    if (profile.interests && session.description) {
      const description = session.description.toLowerCase();
      profile.interests.forEach(interest => {
        if (description.includes(interest.toLowerCase())) {
          score += 15;
        }
      });
    }

    // Tool-based scoring
    if (profile.tools && session.description) {
      const description = session.description.toLowerCase();
      profile.tools.forEach(tool => {
        if (description.includes(tool.toLowerCase())) {
          score += 12;
        }
      });
    }

    // Company/College specific scoring
    if (profile.company && session.description) {
      const description = session.description.toLowerCase();
      if (description.includes('enterprise') || description.includes('corporate')) {
        score += 10;
      }
    }

    if (profile.college && session.description) {
      const description = session.description.toLowerCase();
      if (description.includes('student') || description.includes('career') || description.includes('internship')) {
        score += 10;
      }
    }

    return score;
  },

  // Check for session conflicts
  checkConflicts(selectedSessions: EventSession[]): { hasConflicts: boolean; conflicts: string[] } {
    const conflicts: string[] = [];
    const sortedSessions = selectedSessions.sort((a, b) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    for (let i = 0; i < sortedSessions.length - 1; i++) {
      const current = sortedSessions[i];
      const next = sortedSessions[i + 1];

      const currentEnd = new Date(current.end_time).getTime();
      const nextStart = new Date(next.start_time).getTime();

      if (currentEnd > nextStart) {
        conflicts.push(`${current.title} overlaps with ${next.title}`);
      }
    }

    return {
      hasConflicts: conflicts.length > 0,
      conflicts
    };
  },

  // Get personalized agenda suggestions
  getPersonalizedAgenda(profile: AttendeeProfile, allSessions: EventSession[]): EventSession[] {
    const recommendations = this.getRecommendations(profile, allSessions);
    const agenda: EventSession[] = [];

    // Add keynotes (always recommended)
    const keynotes = allSessions.filter(s => s.category === 'keynote');
    agenda.push(...keynotes);

    // Add top recommendations
    recommendations.forEach(session => {
      if (!agenda.find(s => s.id === session.id)) {
        agenda.push(session);
      }
    });

    // Check for conflicts and resolve
    const { hasConflicts, conflicts } = this.checkConflicts(agenda);
    
    if (hasConflicts) {
      console.warn('Session conflicts detected:', conflicts);
      // In a real implementation, you'd resolve conflicts automatically
    }

    return agenda.slice(0, 8); // Limit to 8 sessions for a manageable agenda
  }
};
