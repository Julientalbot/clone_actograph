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
      color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      id: '2',
      name: 'Travail principal',
      startTime: 120,
      endTime: 480,
      color: 'bg-gradient-to-r from-emerald-500 to-green-600'
    },
    {
      id: '3',
      name: 'Pause',
      startTime: 480,
      endTime: 540,
      color: 'bg-gradient-to-r from-amber-400 to-yellow-500'
    },
    {
      id: '4',
      name: 'Travail principal',
      startTime: 540,
      endTime: 780,
      color: 'bg-gradient-to-r from-emerald-500 to-green-600'
    },
    {
      id: '5',
      name: 'Communication',
      startTime: 780,
      endTime: 900,
      color: 'bg-gradient-to-r from-purple-500 to-violet-600'
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
    <div className="space-y-8">
      {/* Chronogramme visuel */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800">Chronogramme</h3>
        </div>
        
        <div className="glass-morphism rounded-2xl p-6">
          <div className="relative h-24 bg-white rounded-xl shadow-inner overflow-hidden">
            {sampleEvents.map((event) => {
              const left = (event.startTime / totalDuration) * 100;
              const width = ((event.endTime - event.startTime) / totalDuration) * 100;
              
              return (
                <div
                  key={event.id}
                  className={`absolute h-full ${event.color} flex items-center justify-center text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
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
          <div className="relative mt-4 h-6">
            {[0, 300, 600, 900].map((time) => {
              const position = (time / totalDuration) * 100;
              return (
                <div
                  key={time}
                  className="absolute text-xs text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded"
                  style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                >
                  {formatTime(time)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800">Statistiques</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {statistics.map((stat) => (
            <div key={stat.name} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all duration-300 fade-in">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-slate-800">{stat.name}</span>
                <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-mono">
                  {stat.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-3">
                {formatTime(stat.duration)}
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div
                  className="progress-bar h-full transition-all duration-1000 ease-out"
                  style={{ width: `${stat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Résumé */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-blue-900">Résumé</h4>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white/60 rounded-xl p-4">
            <div className="text-sm text-blue-700 mb-1">Durée totale</div>
            <div className="text-2xl font-bold text-blue-900">{formatTime(totalDuration)}</div>
          </div>
          <div className="bg-white/60 rounded-xl p-4">
            <div className="text-sm text-blue-700 mb-1">Nombre d'activités</div>
            <div className="text-2xl font-bold text-blue-900">{sampleEvents.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};