import React, { useState } from 'react';

interface Activity {
  id: string;
  name: string;
  color: string;
  description?: string;
}

interface ActivityEvent {
  id: string;
  activityId: string;
  activityName: string;
  timestamp: number;
  duration?: number;
}

const defaultActivities: Activity[] = [
  { id: '1', name: 'Préparation', color: 'bg-gradient-to-r from-blue-500 to-blue-600', description: 'Préparation du poste' },
  { id: '2', name: 'Travail principal', color: 'bg-gradient-to-r from-emerald-500 to-green-600', description: 'Activité principale' },
  { id: '3', name: 'Pause', color: 'bg-gradient-to-r from-amber-400 to-yellow-500', description: 'Pause/Arrêt' },
  { id: '4', name: 'Attente', color: 'bg-gradient-to-r from-red-500 to-red-600', description: 'Attente/Blocage' },
  { id: '5', name: 'Communication', color: 'bg-gradient-to-r from-purple-500 to-violet-600', description: 'Discussion/Échange' },
];

export const ActivityPanel: React.FC = () => {
  const [activities] = useState<Activity[]>(defaultActivities);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);

  const logActivity = (activity: Activity) => {
    const now = Date.now();
    
    if (currentActivity) {
      // Terminer l'activité précédente
      setEvents(prev => 
        prev.map(event => 
          event.id === currentActivity 
            ? { ...event, duration: now - event.timestamp }
            : event
        )
      );
    }
    
    // Commencer la nouvelle activité
    const newEvent: ActivityEvent = {
      id: Date.now().toString(),
      activityId: activity.id,
      activityName: activity.name,
      timestamp: now,
    };
    
    setEvents(prev => [...prev, newEvent]);
    setCurrentActivity(newEvent.id);
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDuration = (duration: number): string => {
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activities.map((activity) => (
          <button
            key={activity.id}
            onClick={() => logActivity(activity)}
            className={`activity-button ${activity.color} p-5 rounded-2xl text-white font-medium transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl`}
          >
            <div className="text-base font-semibold mb-1">{activity.name}</div>
            {activity.description && (
              <div className="text-sm opacity-90">{activity.description}</div>
            )}
          </button>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800">Historique des activités</h3>
        </div>
        <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-500 text-lg">Aucune activité enregistrée</p>
              <p className="text-slate-400 text-sm mt-1">Cliquez sur une activité pour commencer</p>
            </div>
          ) : (
            events.map((event, index) => (
              <div key={event.id} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-300 fade-in">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div 
                      className={`w-4 h-4 rounded-full ${
                        activities.find(a => a.id === event.activityId)?.color || 'bg-gray-400'
                      }`}
                    />
                    {index === events.length - 1 && !event.duration && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full pulse-animation"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{event.activityName}</div>
                    <div className="text-sm text-slate-500">{formatTime(event.timestamp)}</div>
                  </div>
                </div>
                {event.duration ? (
                  <div className="text-sm font-mono text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                    {formatDuration(event.duration)}
                  </div>
                ) : (
                  <div className="text-sm text-emerald-600 font-medium">
                    En cours...
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};