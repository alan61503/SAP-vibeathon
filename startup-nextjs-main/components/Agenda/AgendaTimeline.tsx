"use client";

import { EventSession } from '@/lib/agenda';

interface AgendaTimelineProps {
  sessions: EventSession[];
  selectedSessions?: string[];
  onToggleSession?: (sessionId: string) => void;
}

export default function AgendaTimeline({ sessions, selectedSessions = [], onToggleSession }: AgendaTimelineProps) {
  // Group sessions by time slots
  const timeSlots = sessions.reduce((acc, session) => {
    const startTime = new Date(session.start_time);
    const timeKey = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (!acc[timeKey]) {
      acc[timeKey] = [];
    }
    acc[timeKey].push(session);
    return acc;
  }, {} as Record<string, EventSession[]>);

  const sortedTimeSlots = Object.keys(timeSlots).sort((a, b) => {
    const timeA = new Date(`2000-01-01 ${a}`);
    const timeB = new Date(`2000-01-01 ${b}`);
    return timeA.getTime() - timeB.getTime();
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        📅 Event Timeline
      </h3>
      
      <div className="space-y-6">
        {sortedTimeSlots.map((timeSlot) => (
          <div key={timeSlot} className="relative">
            {/* Time Slot Header */}
            <div className="flex items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {timeSlot}
                </h4>
              </div>
              <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600 ml-4"></div>
            </div>

            {/* Sessions in this time slot */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-6">
              {timeSlots[timeSlot].map((session) => {
                const startTime = new Date(session.start_time);
                const endTime = new Date(session.end_time);
                const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
                const isSelected = selectedSessions.includes(session.id);

                return (
                  <div
                    key={session.id}
                    className={`bg-white dark:bg-gray-800 rounded-lg p-4 border-2 transition-all duration-200 ${
                      isSelected 
                        ? 'border-primary shadow-lg' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
                          {session.title}
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          👤 {session.speaker}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          ⏱️ {duration}min • 📍 {session.location}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
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

                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {session.description}
                    </p>

                    {onToggleSession && (
                      <button
                        onClick={() => onToggleSession(session.id)}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-primary hover:bg-primary/90 text-white'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : '+ Add to Agenda'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
