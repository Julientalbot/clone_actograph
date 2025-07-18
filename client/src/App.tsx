import React from 'react';
import { Timer } from './components/Timer';
import { ActivityPanel } from './components/ActivityPanel';
import { VideoPlayer } from './components/VideoPlayer';
import { TimelineChart } from './components/TimelineChart';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ActoGraph Clone</h1>
          <p className="text-gray-600 mt-2">Outil d'analyse ergonomique et de chronométrage</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Chronométrage</h2>
              <Timer />
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Activités</h2>
              <ActivityPanel />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Vidéo</h2>
              <VideoPlayer />
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Chronogramme</h2>
              <TimelineChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;