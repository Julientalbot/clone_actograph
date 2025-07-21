import React, { useState } from 'react';
import { Timer } from './components/Timer';
import { ActivityPanel } from './components/ActivityPanel';
import { VideoPlayer } from './components/VideoPlayer';
import { TimelineChart } from './components/TimelineChart';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SessionManager } from './components/SessionManager';
import { InstallPrompt } from './components/InstallPrompt';
import { ThemeToggle } from './components/ThemeToggle';
import { useServiceWorker } from './hooks/useServiceWorker';
import { useStore } from './store/useStore';
import { Toaster } from 'react-hot-toast';

type TabType = 'workspace' | 'analytics';

function App() {
  useServiceWorker();
  const { currentSessionId, createSession } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('workspace');

  // Create default session if none exists
  React.useEffect(() => {
    if (!currentSessionId) {
      createSession(`Session ${new Date().toLocaleDateString('fr-FR')}`);
    }
  }, [currentSessionId, createSession]);

  const tabs = [
    {
      id: 'workspace' as TabType,
      name: 'Espace de travail',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'analytics' as TabType,
      name: 'Analyses',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg flex-shrink-0">
            <svg className="w-10 h-10 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold gradient-text mb-4">ActoGraph Clone</h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg font-medium">Outil d'analyse ergonomique et de chronométrage professionnel</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mt-4"></div>
        </header>
        
        <div className="space-y-8">
          {/* PWA Installation Prompt */}
          <InstallPrompt />
          
          {/* Session Manager */}
          <SessionManager />
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 border-b border-slate-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'workspace' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 fade-in">
              <div className="space-y-8">
                <div className="card p-8">
                  <div className="card-header">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800">Chronométrage</h2>
                    </div>
                  </div>
                  <Timer />
                </div>
                
                <div className="card p-8">
                  <div className="card-header">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800">Activités</h2>
                    </div>
                  </div>
                  <ActivityPanel />
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="card p-8">
                  <div className="card-header">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800">Vidéo</h2>
                    </div>
                  </div>
                  <VideoPlayer />
                </div>
                
                <div className="card p-8">
                  <div className="card-header">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800">Chronogramme</h2>
                    </div>
                  </div>
                  <TimelineChart />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="fade-in">
              <AnalyticsDashboard />
            </div>
          )}
        </div>
      </div>
      
      {/* Toast Notifications */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#f9fafb',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f9fafb',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f9fafb',
            },
          },
        }}
      />
    </div>
  );
}

export default App;