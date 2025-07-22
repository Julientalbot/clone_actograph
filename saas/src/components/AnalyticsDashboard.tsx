'use client';

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TimelineData {
  label: string;
  [key: string]: string | number;
}

interface AnalyticsProps {
  sessionId?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsProps> = ({ sessionId }) => {
  const { sessions, currentSessionId, activities } = useWorkspaceStore();
  const targetSessionId = sessionId || currentSessionId;
  const currentSession = sessions.find(s => s.id === targetSessionId);

  const analytics = useMemo(() => {
    if (!currentSession || !currentSession.events.length) return null;

    const events = currentSession.events;
    const totalDuration = events.reduce((sum, event) => sum + (event.duration || 0), 0);

    // Définir les couleurs par défaut pour les activités
    const activityColors: Record<string, string> = {
      'Préparation': '#3B82F6',
      'Travail principal': '#10B981',
      'Pause': '#F59E0B',
      'Attente': '#EF4444',
      'Communication': '#8B5CF6'
    };

    // Répartition par activité
    const activityStats = Object.entries(
      events.reduce((acc, event) => {
        if (event.duration) {
          const key = event.activityName;
          if (!acc[key]) {
            acc[key] = { duration: 0, count: 0, name: key };
          }
          acc[key].duration += event.duration;
          acc[key].count += 1;
        }
        return acc;
      }, {} as Record<string, { duration: number; count: number; name: string }>)
    ).map(([name, stats]) => ({
      name,
      duration: stats.duration,
      count: stats.count,
      percentage: totalDuration > 0 ? (stats.duration / totalDuration) * 100 : 0,
      avgDuration: stats.count > 0 ? stats.duration / stats.count : 0,
      color: activityColors[name] || '#6B7280'
    }));

    // Données pour graphique temporel (par tranches de 5 minutes)
    const timelineData: TimelineData[] = [];
    if (events.length > 0) {
      const firstEvent = Math.min(...events.map(e => e.timestamp));
      const lastEvent = Math.max(...events.map(e => e.timestamp + (e.duration || 0)));
      const duration = lastEvent - firstEvent;
      const intervals = Math.ceil(duration / (5 * 60 * 1000)); // Tranches de 5 minutes

      for (let i = 0; i < intervals; i++) {
        const startTime = firstEvent + i * 5 * 60 * 1000;
        const endTime = startTime + 5 * 60 * 1000;
        const label = new Date(startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        const intervalData: TimelineData = { label };
        
        activityStats.forEach(stat => {
          const activityDuration = events
            .filter(e => e.activityName === stat.name)
            .reduce((sum, event) => {
              if (!event.duration) return sum;
              const eventStart = event.timestamp;
              const eventEnd = event.timestamp + event.duration;
              
              // Calcul de l'intersection avec l'intervalle
              const overlapStart = Math.max(eventStart, startTime);
              const overlapEnd = Math.min(eventEnd, endTime);
              const overlap = Math.max(0, overlapEnd - overlapStart);
              
              return sum + overlap;
            }, 0);

          intervalData[stat.name] = activityDuration / (60 * 1000); // En minutes
        });

        timelineData.push(intervalData);
      }
    }

    return { activityStats, timelineData, totalDuration };
  }, [currentSession]);

  const formatDuration = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else if (minutes > 0) {
      return `${minutes}min ${seconds}s`;
    }
    return `${seconds}s`;
  };

  if (!currentSession) {
    return (
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-700/20 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-lg">Sélectionnez une session pour voir les analyses</p>
      </div>
    );
  }

  if (!analytics || analytics.activityStats.length === 0) {
    return (
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-700/20 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-lg">Aucune donnée à analyser</p>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Enregistrez des activités pour voir les statistiques</p>
      </div>
    );
  }

  // Configuration des graphiques
  const doughnutData = {
    labels: analytics.activityStats.map(stat => stat.name),
    datasets: [
      {
        data: analytics.activityStats.map(stat => stat.percentage),
        backgroundColor: analytics.activityStats.map(stat => stat.color),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const lineData = {
    labels: analytics.timelineData.map(d => d.label),
    datasets: analytics.activityStats.map((stat) => ({
      label: stat.name,
      data: analytics.timelineData.map(d => d[stat.name] as number || 0),
      borderColor: stat.color,
      backgroundColor: stat.color + '20',
      fill: true,
      tension: 0.4,
    })),
  };

  const barData = {
    labels: analytics.activityStats.map(stat => stat.name),
    datasets: [
      {
        label: 'Nombre d\'occurrences',
        data: analytics.activityStats.map(stat => stat.count),
        backgroundColor: analytics.activityStats.map(stat => stat.color),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          color: '#64748b',
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Analyse de Session: {currentSession.name}</h2>
      </div>

      {/* Métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Durée totale</p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{formatDuration(analytics.totalDuration)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">Activités</p>
              <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">{currentSession.events.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-amber-700 dark:text-amber-300">Types d'activités</p>
              <p className="text-xl font-bold text-amber-900 dark:text-amber-100">{analytics.activityStats.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-violet-700 dark:text-violet-300">Efficacité</p>
              <p className="text-xl font-bold text-violet-900 dark:text-violet-100">
                {((analytics.activityStats.find(s => s.name === 'Travail principal')?.percentage || 0)).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Répartition des activités */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Répartition des activités</h3>
          <div className="h-64">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </div>

        {/* Occurrences par activité */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
          <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Fréquence des activités</h3>
          <div className="h-64">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Timeline des activités */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Évolution temporelle (par tranches de 5 min)</h3>
        <div className="h-80">
          <Line 
            data={lineData} 
            options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Durée (minutes)',
                    color: '#64748b',
                  },
                  ticks: {
                    color: '#64748b',
                  },
                  grid: {
                    color: '#e2e8f0',
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: 'Heure',
                    color: '#64748b',
                  },
                  ticks: {
                    color: '#64748b',
                  },
                  grid: {
                    color: '#e2e8f0',
                  },
                },
              },
            }} 
          />
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Statistiques détaillées</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-600">
                <th className="text-left py-2 font-semibold text-slate-700 dark:text-slate-300">Activité</th>
                <th className="text-right py-2 font-semibold text-slate-700 dark:text-slate-300">Durée totale</th>
                <th className="text-right py-2 font-semibold text-slate-700 dark:text-slate-300">Occurrences</th>
                <th className="text-right py-2 font-semibold text-slate-700 dark:text-slate-300">Durée moyenne</th>
                <th className="text-right py-2 font-semibold text-slate-700 dark:text-slate-300">Pourcentage</th>
              </tr>
            </thead>
            <tbody>
              {analytics.activityStats.map((stat) => (
                <tr key={stat.name} className="border-b border-slate-100 dark:border-slate-700">
                  <td className="py-3 font-medium text-slate-800 dark:text-slate-200">{stat.name}</td>
                  <td className="text-right py-3 text-slate-600 dark:text-slate-400">{formatDuration(stat.duration)}</td>
                  <td className="text-right py-3 text-slate-600 dark:text-slate-400">{stat.count}</td>
                  <td className="text-right py-3 text-slate-600 dark:text-slate-400">{formatDuration(stat.avgDuration)}</td>
                  <td className="text-right py-3 font-semibold text-slate-800 dark:text-slate-200">{stat.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};