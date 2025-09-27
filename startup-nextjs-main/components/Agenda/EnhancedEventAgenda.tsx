"use client";

import { useState, useEffect } from 'react';
import { agenda, EventSession, PersonalizedAgenda } from '@/lib/agenda';
import { aiRecommendations, AttendeeProfile } from '@/lib/ai-recommendations';
import { calendarService } from '@/lib/calendar';
import AgendaTimeline from './AgendaTimeline';

interface EnhancedEventAgendaProps {
  attendeeId: string;
  attendeeProfile?: AttendeeProfile;
}

export default function EnhancedEventAgenda({ attendeeId, attendeeProfile }: EnhancedEventAgendaProps) {
  const [sessions, setSessions] = useState<EventSession[]>([]);
  const [personalizedAgenda, setPersonalizedAgenda] = useState<PersonalizedAgenda[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<EventSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showConflicts, setShowConflicts] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  useEffect(() => {
    fetchSessions();
    fetchPersonalizedAgenda();
  }, [attendeeId]);

  useEffect(() => {
    if (attendeeProfile && sessions.length > 0) {
      const recommendations = aiRecommendations.getRecommendations(attendeeProfile, sessions);
      setAiRecommendations(recommendations);
    }
  }, [attendeeProfile, sessions]);

  const fetchSessions = async () => {
    try {
      const { data, error } = await agenda.getAllSessions();
      if (error) {
        setError(error.message);
      } else {
        setSessions(data || []);
      }
    } catch (err) {
      setError('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalizedAgenda = async () => {
    try {
      const { data, error } = await agenda.getPersonalizedAgenda(attendeeId);
      if (error) {
        console.error('Failed to fetch personalized agenda:', error);
      } else {
        setPersonalizedAgenda(data || []);
      }
    } catch (err) {
      console.error('Error fetching personalized agenda:', err);
    }
  };

  const toggleSessionInAgenda = async (sessionId: string) => {
    try {
      const { isInAgenda } = await agenda.isInAgenda(attendeeId, sessionId);
      
      if (isInAgenda) {
        await agenda.removeFromAgenda(attendeeId, sessionId);
      } else {
        await agenda.addToAgenda(attendeeId, sessionId);
      }
      
      fetchPersonalizedAgenda();
    } catch (err) {
      console.error('Error toggling session:', err);
    }
  };

  const isSessionInAgenda = (sessionId: string) => {
    return personalizedAgenda.some(item => item.session_id === sessionId);
  };

  const getSelectedSessions = (): EventSession[] => {
    return personalizedAgenda
      .map(item => item.session)
      .filter((session): session is EventSession => session !== undefined);
  };

  const checkForConflicts = () => {
    const selectedSessions = getSelectedSessions();
    const { hasConflicts, conflicts } = aiRecommendations.checkConflicts(selectedSessions);
    setShowConflicts(hasConflicts);
    return { hasConflicts, conflicts };
  };

  const addToCalendar = async (session: EventSession, provider: 'google' | 'outlook' | 'ics') => {
    await calendarService.addToCalendar(session, provider);
  };

  const addAllToCalendar = async (provider: 'google' | 'outlook' | 'ics') => {
    const selectedSessions = getSelectedSessions();
    await calendarService.addMultipleToCalendar(selectedSessions, provider);
  };

  const filteredSessions = selectedCategory === 'all' 
    ? sessions 
    : sessions.filter(session => session.category === selectedCategory);

  const categories = [
    { value: 'all', label: 'All Sessions' },
    { value: 'keynote', label: 'Keynotes' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'panel', label: 'Panels' },
    { value: 'networking', label: 'Networking' },
    { value: 'break', label: 'Breaks' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-700 dark:text-red-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Event Agenda
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Build your personalized agenda with AI recommendations and calendar integration.
        </p>
      </div>

      {/* AI Recommendations */}
      {aiRecommendations.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              🤖 AI Recommendations for You
            </h3>
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="text-primary hover:text-primary/80 font-medium"
            >
              {showRecommendations ? 'Hide' : 'Show'} Recommendations
            </button>
          </div>
          
          {showRecommendations && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiRecommendations.map((session: any) => (
                <div key={session.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-800 relative">
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
                      {session.recommendationScore}% match
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 pr-16">{session.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">👤 {session.speaker}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">
                    🕐 {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(session.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  
                  {session.recommendationReasons && session.recommendationReasons.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Why recommended:</p>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        {session.recommendationReasons.map((reason: string, index: number) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-blue-500 mt-0.5">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <button
                    onClick={() => toggleSessionInAgenda(session.id)}
                    className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isSessionInAgenda(session.id)
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isSessionInAgenda(session.id) ? '✓ Added' : '+ Add to Agenda'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Conflict Detection */}
      {personalizedAgenda.length > 0 && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300">
              🔍 Conflict Detection
            </h3>
            <button
              onClick={() => {
                const { hasConflicts, conflicts, conflictDetails } = checkForConflicts();
                if (hasConflicts) {
                  // Show detailed conflict information
                  const conflictSummary = conflicts.map((conflict, index) => {
                    const detail = conflictDetails[index];
                    const severity = detail?.severity || 'medium';
                    const severityIcon = severity === 'high' ? '🔴' : severity === 'medium' ? '🟡' : '🟢';
                    return `${severityIcon} ${conflict}`;
                  }).join('\n');
                  
                  alert(`Session conflicts detected:\n\n${conflictSummary}\n\nPlease review your agenda and remove conflicting sessions.`);
                } else {
                  alert('✅ No conflicts found in your agenda! Your schedule looks good.');
                }
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Check for Conflicts
            </button>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Ensure your selected sessions don't overlap in time or location. Click the button above to check for any scheduling conflicts.
          </p>
        </div>
      )}

      {/* Calendar Integration */}
      {personalizedAgenda.length > 0 && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-3">
            📅 Add to Calendar
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => addAllToCalendar('google')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              📅 Google Calendar
            </button>
            <button
              onClick={() => addAllToCalendar('outlook')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              📅 Outlook Calendar
            </button>
            <button
              onClick={() => addAllToCalendar('ics')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              📥 Download ICS
            </button>
          </div>
        </div>
      )}

      {/* View Mode Toggle and Category Filter */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📋 Grid View
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📅 Timeline View
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sessions Display */}
      {viewMode === 'timeline' ? (
        <AgendaTimeline 
          sessions={filteredSessions} 
          selectedSessions={personalizedAgenda.map(item => item.session_id)}
          onToggleSession={toggleSessionInAgenda}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => {
          const startTime = new Date(session.start_time);
          const endTime = new Date(session.end_time);
          const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
          const isFull = session.max_capacity && session.current_attendees && session.current_attendees >= session.max_capacity;
          const spotsLeft = session.max_capacity && session.current_attendees ? session.max_capacity - session.current_attendees : null;

          return (
            <div
              key={session.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border transition-all duration-200 hover:shadow-xl ${
                isFull ? 'border-red-200 dark:border-red-800 opacity-75' : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                    👤 {session.speaker}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      🕐 {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      ⏱️ {duration}min
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session.category === 'keynote' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                    session.category === 'workshop' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    session.category === 'panel' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                    session.category === 'networking' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {session.category}
                  </span>
                  {session.track && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400">
                      {session.track}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {session.description}
              </p>

              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-1">
                  📍 {session.location}
                </div>
                {spotsLeft !== null && (
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    isFull ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                    spotsLeft <= 10 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {isFull ? 'Full' : `${spotsLeft} spots left`}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => toggleSessionInAgenda(session.id)}
                  disabled={isFull}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    isFull ? 'bg-gray-400 text-gray-200 cursor-not-allowed' :
                    isSessionInAgenda(session.id)
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-primary hover:bg-primary/90 text-white'
                  }`}
                >
                  {isFull ? 'Session Full' : isSessionInAgenda(session.id) ? '✓ Added to Agenda' : '+ Add to Agenda'}
                </button>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCalendar(session, 'google')}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs transition-colors"
                    title="Add to Google Calendar"
                  >
                    📅 Google
                  </button>
                  <button
                    onClick={() => addToCalendar(session, 'outlook')}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs transition-colors"
                    title="Add to Outlook Calendar"
                  >
                    📅 Outlook
                  </button>
                  <button
                    onClick={() => addToCalendar(session, 'ics')}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded text-xs transition-colors"
                    title="Download ICS file"
                  >
                    📥 ICS
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Personalized Agenda Summary */}
      {personalizedAgenda.length > 0 && (
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4">
            Your Personalized Agenda ({personalizedAgenda.length} sessions)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalizedAgenda.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {item.session?.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.session?.speaker} • {item.session?.location}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {new Date(item.session?.start_time || '').toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })} - {new Date(item.session?.end_time || '').toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
