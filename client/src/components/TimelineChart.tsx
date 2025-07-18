import React from 'react';

interface TimelineEvent {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  color: string;
}

export const TimelineChart: React.FC = () => {
  // Données d'exemple pour le chronogramme
  const sampleEvents: TimelineEvent[] = [
    {
      id: '1',
      name: 'Préparation',
      startTime: 0,
      endTime: 120,
      color: 'bg-blue-500'
    },
    {
      id: '2',
      name: 'Travail principal',
      startTime: 120,
      endTime: 480,
      color: 'bg-green-500'
    },
    {
      id: '3',
      name: 'Pause',
      startTime: 480,
      endTime: 540,
      color: 'bg-yellow-500'
    },
    {
      id: '4',
      name: 'Travail principal',
      startTime: 540,
      endTime: 780,
      color: 'bg-green-500'
    },
    {
      id: '5',
      name: 'Communication',
      startTime: 780,
      endTime: 900,
      color: 'bg-purple-500'
    }
  ];

  const totalDuration = Math.max(...sampleEvents.map(e => e.endTime));
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatistics = () => {
    const stats = sampleEvents.reduce((acc, event) => {
      const duration = event.endTime - event.startTime;
      acc[event.name] = (acc[event.name] || 0) + duration;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([name, duration]) => ({
      name,
      duration,
      percentage: (duration / totalDuration) * 100
    }));
  };

  const statistics = getStatistics();

  return (
    <div className="space-y-6">
      {/* Chronogramme visuel */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Chronogramme</h3>
        
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="relative h-20 bg-white rounded border">
            {sampleEvents.map((event) => {
              const left = (event.startTime / totalDuration) * 100;
              const width = ((event.endTime - event.startTime) / totalDuration) * 100;
              
              return (
                <div
                  key={event.id}
                  className={`absolute h-full ${event.color} opacity-80 flex items-center justify-center text-white text-sm font-medium`}
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                  }}
                  title={`${event.name}: ${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}
                >
                  {width > 15 && event.name}
                </div>
              );
            })}
          </div>
          
          {/* Échelle temporelle */}
          <div className="relative mt-2 h-6">
            {[0, 300, 600, 900].map((time) => {
              const position = (time / totalDuration) * 100;
              return (
                <div
                  key={time}
                  className="absolute text-xs text-gray-600"
                  style={{ left: `${position}%` }}
                >
                  {formatTime(time)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Statistiques</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {statistics.map((stat) => (
            <div key={stat.name} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{stat.name}</span>
                <span className="text-sm text-gray-600">
                  {stat.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(stat.duration)}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Résumé */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Résumé</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Durée totale:</span>
            <span className="font-medium ml-2">{formatTime(totalDuration)}</span>
          </div>
          <div>
            <span className="text-blue-700">Nombre d'activités:</span>
            <span className="font-medium ml-2">{sampleEvents.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};