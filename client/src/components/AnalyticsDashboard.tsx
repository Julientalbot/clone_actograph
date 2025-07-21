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
import { useStore } from '../store/useStore';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import { fr } from 'date-fns/locale';

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

export const AnalyticsDashboard: React.FC = () => {
  const { sessions, currentSessionId, activities } = useStore();
  const currentSession = sessions.find(s => s.id === currentSessionId);

  const analytics = useMemo(() => {
    if (!currentSession || !currentSession.events.length) return null;

    const events = currentSession.events;
    const totalDuration = events.reduce((sum, event) => sum + (event.duration || 0), 0);

    // Répartition par activité
    const activityStats = activities.map(activity => {
      const activityEvents = events.filter(e => e.activityId === activity.id);
      const duration = activityEvents.reduce((sum, event) => sum + (event.duration || 0), 0);
      const count = activityEvents.length;
      const percentage = totalDuration > 0 ? (duration / totalDuration) * 100 : 0;

      return {
        id: activity.id,
        name: activity.name,
        color: activity.color,
        duration,
        count,
        percentage,
        avgDuration: count > 0 ? duration / count : 0,
      };
    }).filter(stat => stat.count > 0);

    // Données pour graphique temporel (par tranches de 5 minutes)
    if (events.length === 0) return { activityStats, timelineData: [], totalDuration };

    const firstEvent = Math.min(...events.map(e => e.timestamp));
    const lastEvent = Math.max(...events.map(e => e.timestamp + (e.duration || 0)));
    const duration = lastEvent - firstEvent;
    const intervals = Math.ceil(duration / (5 * 60 * 1000)); // Tranches de 5 minutes

    const timelineData = Array.from({ length: intervals }, (_, i) => {
      const startTime = firstEvent + i * 5 * 60 * 1000;
      const endTime = startTime + 5 * 60 * 1000;
      const label = format(startTime, 'HH:mm', { locale: fr });

      const intervalStats = activities.reduce((acc, activity) => {
        const activityDuration = events
          .filter(e => e.activityId === activity.id)
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

        acc[activity.id] = activityDuration / (60 * 1000); // En minutes
        return acc;
      }, {} as Record<string, number>);

      return { label, ...intervalStats };
    });

    return { activityStats, timelineData, totalDuration };
  }, [currentSession, activities]);

  if (!currentSession) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-slate-600 text-lg">Sélectionnez une session pour voir les analyses</p>
      </div>
    );
  }

  if (!analytics || analytics.activityStats.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <p className="text-slate-600 text-lg">Aucune donnée à analyser</p>
        <p className="text-slate-500 text-sm mt-1">Enregistrez des activités pour voir les statistiques</p>
      </div>
    );
  }

  // Configuration des graphiques
  const doughnutData = {
    labels: analytics.activityStats.map(stat => stat.name),
    datasets: [
      {
        data: analytics.activityStats.map(stat => stat.percentage),
        backgroundColor: [
          '#3B82F6', // Bleu
          '#10B981', // Vert
          '#F59E0B', // Jaune
          '#EF4444', // Rouge
          '#8B5CF6', // Violet
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const lineData = {
    labels: analytics.timelineData.map(d => d.label),
    datasets: activities
      .filter(activity => analytics.activityStats.some(s => s.id === activity.id))
      .map((activity, index) => ({
        label: activity.name,
        data: analytics.timelineData.map(d => (d as any)[activity.id] || 0),
        borderColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index] + '20',
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
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  const formatDurationMs = (ms: number): string => {
    const duration = intervalToDuration({ start: 0, end: ms });
    return formatDuration(duration, { locale: fr });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Analyse de Session</h2>
      </div>

      {/* Métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-700">Durée totale</p>
              <p className="text-xl font-bold text-blue-900">{formatDurationMs(analytics.totalDuration)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-emerald-700">Activités</p>
              <p className="text-xl font-bold text-emerald-900">{currentSession.events.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-amber-700">Types d'activités</p>
              <p className="text-xl font-bold text-amber-900">{analytics.activityStats.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-violet-700">Efficacité</p>
              <p className="text-xl font-bold text-violet-900">
                {((analytics.activityStats.find(s => s.name === 'Travail principal')?.percentage || 0)).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Répartition des activités */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Répartition des activités</h3>
          <div className="h-64">
            <Doughnut data={doughnutData} options={chartOptions} />
          </div>
        </div>

        {/* Occurrences par activité */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Fréquence des activités</h3>
          <div className="h-64">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Timeline des activités */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Évolution temporelle (par tranches de 5 min)</h3>
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
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: 'Heure',
                  },
                },
              },
            }} 
          />
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Statistiques détaillées</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 font-semibold text-slate-700">Activité</th>
                <th className="text-right py-2 font-semibold text-slate-700">Durée totale</th>
                <th className="text-right py-2 font-semibold text-slate-700">Occurrences</th>
                <th className="text-right py-2 font-semibold text-slate-700">Durée moyenne</th>
                <th className="text-right py-2 font-semibold text-slate-700">Pourcentage</th>
              </tr>
            </thead>
            <tbody>
              {analytics.activityStats.map((stat) => (
                <tr key={stat.id} className="border-b border-slate-100">
                  <td className="py-3 font-medium text-slate-800">{stat.name}</td>
                  <td className="text-right py-3 text-slate-600">{formatDurationMs(stat.duration)}</td>
                  <td className="text-right py-3 text-slate-600">{stat.count}</td>
                  <td className="text-right py-3 text-slate-600">{formatDurationMs(stat.avgDuration)}</td>
                  <td className="text-right py-3 font-semibold text-slate-800">{stat.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};