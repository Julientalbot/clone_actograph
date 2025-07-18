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
  { id: '1', name: 'Préparation', color: 'bg-blue-500', description: 'Préparation du poste' },
  { id: '2', name: 'Travail principal', color: 'bg-green-500', description: 'Activité principale' },
  { id: '3', name: 'Pause', color: 'bg-yellow-500', description: 'Pause/Arrêt' },
  { id: '4', name: 'Attente', color: 'bg-red-500', description: 'Attente/Blocage' },
  { id: '5', name: 'Communication', color: 'bg-purple-500', description: 'Discussion/Échange' },
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activities.map((activity) => (
          <button
            key={activity.id}
            onClick={() => logActivity(activity)}
            className={`p-4 rounded-lg text-white font-medium transition-transform hover:scale-105 ${activity.color}`}
          >
            <div className="text-sm font-semibold">{activity.name}</div>
            {activity.description && (
              <div className="text-xs opacity-90 mt-1">{activity.description}</div>
            )}
          </button>
        ))}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Historique des activités</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune activité enregistrée</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div 
                    className={`w-3 h-3 rounded-full ${
                      activities.find(a => a.id === event.activityId)?.color || 'bg-gray-400'
                    }`}
                  />
                  <div>
                    <div className="font-medium">{event.activityName}</div>
                    <div className="text-sm text-gray-500">{formatTime(event.timestamp)}</div>
                  </div>
                </div>
                {event.duration && (
                  <div className="text-sm font-mono text-gray-700">
                    {formatDuration(event.duration)}
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