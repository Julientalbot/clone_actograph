'use client';

import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useAuth } from '@/hooks/useAuth';

export default function AnalyticsPage() {
  const { sessions, currentSessionId } = useWorkspaceStore();

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const allEvents = sessions.flatMap(s => s.events);

  // Calculate stats
  const totalSessions = sessions.length;
  const totalEvents = allEvents.length;
  const completedEvents = allEvents.filter(e => e.duration).length;
  const totalDuration = allEvents.reduce((acc, e) => acc + (e.duration || 0), 0);

  const formatDuration = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  // Activity breakdown
  const activityBreakdown = allEvents.reduce((acc, event) => {
    if (event.duration) {
      acc[event.activityName] = (acc[event.activityName] || 0) + event.duration;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Analytics & Rapports
        </h1>
        <p className="text-xl text-slate-600">
          Analysez vos données d'activité et générez des rapports détaillés
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{totalSessions}</div>
          <div className="text-sm text-slate-600">Sessions totales</div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{totalEvents}</div>
          <div className="text-sm text-slate-600">Activités enregistrées</div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{formatDuration(totalDuration)}</div>
          <div className="text-sm text-slate-600">Temps total analysé</div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">{completedEvents}</div>
          <div className="text-sm text-slate-600">Activités complétées</div>
        </div>
      </div>

      {/* Activity Breakdown */}
      {Object.keys(activityBreakdown).length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Répartition par activité</h2>
          <div className="space-y-4">
            {Object.entries(activityBreakdown).map(([activity, duration]) => {
              const percentage = (duration / totalDuration) * 100;
              return (
                <div key={activity} className="flex items-center space-x-4">
                  <div className="w-32 text-sm font-medium text-slate-700 truncate">{activity}</div>
                  <div className="flex-1">
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 w-16 text-right">{formatDuration(duration)}</div>
                  <div className="text-xs text-slate-500 w-12 text-right">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Current Session Details */}
      {currentSession && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Session actuelle: {currentSession.name}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              currentSession.status === 'active' ? 'bg-green-100 text-green-800' :
              currentSession.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {currentSession.status === 'active' ? 'Active' : 
               currentSession.status === 'completed' ? 'Terminée' : 'Brouillon'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl font-bold text-slate-900">{currentSession.events.length}</div>
              <div className="text-sm text-slate-600">Activités</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl font-bold text-slate-900">
                {formatDuration(currentSession.events.reduce((acc, e) => acc + (e.duration || 0), 0))}
              </div>
              <div className="text-sm text-slate-600">Durée totale</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <div className="text-2xl font-bold text-slate-900">
                {new Date(currentSession.createdAt).toLocaleDateString('fr-FR')}
              </div>
              <div className="text-sm text-slate-600">Date de création</div>
            </div>
          </div>

          {currentSession.events.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Chronologie des activités</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {currentSession.events.map((event, index) => (
                  <div key={event.id} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{event.activityName}</div>
                      <div className="text-sm text-slate-500">
                        {new Date(event.timestamp).toLocaleTimeString('fr-FR')}
                      </div>
                    </div>
                    <div className="text-sm font-mono text-slate-700">
                      {event.duration ? formatDuration(event.duration) : 'En cours...'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Data State */}
      {totalEvents === 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Aucune donnée d'analyse</h3>
          <p className="text-slate-600 mb-6">Commencez à enregistrer des activités pour voir les analytics ici.</p>
          <a
            href="/dashboard/workspace"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Aller à l'espace de travail</span>
          </a>
        </div>
      )}

      {/* Export Options */}
      {totalEvents > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Exporter vos données</h3>
              <p className="text-blue-100">
                Générez des rapports détaillés au format PDF ou Excel pour vos analyses.
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                PDF
              </button>
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}