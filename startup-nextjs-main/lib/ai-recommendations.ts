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
  
  // Get reasons why a session is recommended
  getRecommendationReasons(session: EventSession, profile: AttendeeProfile): string[];
  
  // Calculate session relevance score
  calculateSessionScore(session: EventSession, profile: AttendeeProfile): number;
  
  // Check for session conflicts
  checkConflicts(selectedSessions: EventSession[]): { hasConflicts: boolean; conflicts: string[]; conflictDetails: any[] };
  
  // Get conflict type
  getConflictType(start1: Date, end1: Date, start2: Date, end2: Date): string;
  
  // Get conflict severity
  getConflictSeverity(overlapMinutes: number, conflictType: string): 'low' | 'medium' | 'high';
  
  // Check for location conflicts
  checkLocationConflicts(sessions: EventSession[]): { conflicts: string[]; details: any[] };
  
  // Get personalized agenda suggestions
  getPersonalizedAgenda(profile: AttendeeProfile, allSessions: EventSession[]): EventSession[];
}

const aiRecommendations: RecommendationEngine = {
  // Get AI-based session recommendations
  getRecommendations(profile: AttendeeProfile, allSessions: EventSession[]): EventSession[] {
    const recommendations: EventSession[] = [];
    const scoredSessions = allSessions.map(session => ({
      session,
      score: this.calculateSessionScore(session, profile),
      reasons: this.getRecommendationReasons(session, profile)
    }));

    // Sort by score and return top recommendations
    const topRecommendations = scoredSessions
      .sort((a, b) => b.score - a.score)
      .slice(0, 8); // Top 8 recommendations

    // Add recommendation reasons to session objects
    topRecommendations.forEach(item => {
      const sessionWithReasons = {
        ...item.session,
        recommendationScore: item.score,
        recommendationReasons: item.reasons
      };
      recommendations.push(sessionWithReasons);
    });

    return recommendations;
  },

  // Get reasons why a session is recommended
  getRecommendationReasons(session: EventSession, profile: AttendeeProfile): string[] {
    const reasons: string[] = [];

    // Track-based reasons
    if (session.track) {
      if (profile.userType === 'professional' && session.track === 'business') {
        reasons.push('Business-focused content for professionals');
      }
      if (profile.userType === 'student' && session.track === 'technical') {
        reasons.push('Technical skills development for students');
      }
    }

    // Category-based reasons
    switch (session.category) {
      case 'keynote':
        reasons.push('Important keynote session');
        break;
      case 'workshop':
        if (profile.userType === 'student') {
          reasons.push('Hands-on learning opportunity');
        } else {
          reasons.push('Practical skill development');
        }
        break;
      case 'panel':
        if (profile.userType === 'professional') {
          reasons.push('Industry insights and networking');
        }
        break;
      case 'networking':
        reasons.push('Great networking opportunity');
        break;
    }

    // Interest-based reasons
    if (profile.interests && session.description) {
      const description = session.description.toLowerCase();
      profile.interests.forEach(interest => {
        if (description.includes(interest.toLowerCase())) {
          reasons.push(`Matches your interest in ${interest}`);
        }
      });
    }

    // Tool-based reasons
    if (profile.tools && session.description) {
      const description = session.description.toLowerCase();
      profile.tools.forEach(tool => {
        if (description.includes(tool.toLowerCase())) {
          reasons.push(`Covers ${tool} technology`);
        }
      });
    }

    // Time-based reasons
    const sessionHour = new Date(session.start_time).getHours();
    if (sessionHour >= 9 && sessionHour <= 11) {
      reasons.push('Morning session - high energy time');
    }

    return reasons.slice(0, 3); // Limit to top 3 reasons
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
  checkConflicts(selectedSessions: EventSession[]): { hasConflicts: boolean; conflicts: string[]; conflictDetails: any[] } {
    const conflicts: string[] = [];
    const conflictDetails: any[] = [];
    const sortedSessions = selectedSessions.sort((a, b) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    for (let i = 0; i < sortedSessions.length - 1; i++) {
      const current = sortedSessions[i];
      const next = sortedSessions[i + 1];

      const currentStart = new Date(current.start_time);
      const currentEnd = new Date(current.end_time);
      const nextStart = new Date(next.start_time);
      const nextEnd = new Date(next.end_time);

      // Check for overlap
      if (currentEnd > nextStart) {
        const overlapMinutes = Math.round((currentEnd.getTime() - nextStart.getTime()) / (1000 * 60));
        const conflictType = this.getConflictType(currentStart, currentEnd, nextStart, nextEnd);
        
        conflicts.push(`${current.title} conflicts with ${next.title} (${overlapMinutes}min overlap)`);
        
        conflictDetails.push({
          session1: current,
          session2: next,
          overlapMinutes,
          conflictType,
          severity: this.getConflictSeverity(overlapMinutes, conflictType)
        });
      }
    }

    // Check for location conflicts
    const locationConflicts = this.checkLocationConflicts(sortedSessions);
    conflicts.push(...locationConflicts.conflicts);
    conflictDetails.push(...locationConflicts.details);

    return {
      hasConflicts: conflicts.length > 0,
      conflicts,
      conflictDetails
    };
  },

  // Get conflict type
  getConflictType(start1: Date, end1: Date, start2: Date, end2: Date): string {
    if (start1 <= start2 && end1 >= end2) {
      return 'Complete Overlap';
    } else if (start1 < start2 && end1 > start2) {
      return 'Partial Overlap - First extends into second';
    } else if (start2 < start1 && end2 > start1) {
      return 'Partial Overlap - Second extends into first';
    } else {
      return 'Adjacent Sessions';
    }
  },

  // Get conflict severity
  getConflictSeverity(overlapMinutes: number, conflictType: string): 'low' | 'medium' | 'high' {
    if (overlapMinutes > 30) return 'high';
    if (overlapMinutes > 15) return 'medium';
    if (conflictType === 'Complete Overlap') return 'high';
    return 'low';
  },

  // Check for location conflicts
  checkLocationConflicts(sessions: EventSession[]): { conflicts: string[]; details: any[] } {
    const conflicts: string[] = [];
    const details: any[] = [];
    const locationMap = new Map<string, EventSession[]>();

    // Group sessions by location
    sessions.forEach(session => {
      if (!locationMap.has(session.location)) {
        locationMap.set(session.location, []);
      }
      locationMap.get(session.location)!.push(session);
    });

    // Check for conflicts in each location
    locationMap.forEach((locationSessions, location) => {
      if (locationSessions.length > 1) {
        const sortedLocationSessions = locationSessions.sort((a, b) => 
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );

        for (let i = 0; i < sortedLocationSessions.length - 1; i++) {
          const current = sortedLocationSessions[i];
          const next = sortedLocationSessions[i + 1];

          const currentEnd = new Date(current.end_time).getTime();
          const nextStart = new Date(next.start_time).getTime();

          if (currentEnd > nextStart) {
            const overlapMinutes = Math.round((currentEnd - nextStart) / (1000 * 60));
            conflicts.push(`Location conflict: ${current.title} and ${next.title} both in ${location} (${overlapMinutes}min overlap)`);
            
            details.push({
              type: 'location',
              location,
              session1: current,
              session2: next,
              overlapMinutes,
              severity: this.getConflictSeverity(overlapMinutes, 'Location Conflict')
            });
          }
        }
      }
    });

    return { conflicts, details };
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

export { aiRecommendations };
