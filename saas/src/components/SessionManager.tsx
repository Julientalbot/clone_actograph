import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import toast from 'react-hot-toast';

export const SessionManager: React.FC = () => {
  const { 
    sessions, 
    currentSessionId, 
    createSession, 
    loadSession, 
    deleteSession, 
    exportSession, 
    importSession,
    syncToSupabase
  } = useWorkspaceStore();
  
  const [showModal, setShowModal] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [showSessions, setShowSessions] = useState(false);

  const handleCreateSession = async () => {
    if (sessionName.trim()) {
      createSession(sessionName.trim());
      setSessionName('');
      setShowModal(false);
      toast.success('Session créée avec succès!');
    }
  };

  const handleExport = async (sessionId: string) => {
    try {
      const data = await exportSession(sessionId);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `actograph-session-${sessionId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Session exportée!');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result as string;
          await importSession(data);
          toast.success('Session importée avec succès!');
        } catch (error) {
          toast.error('Erreur lors de l\'import');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette session?')) {
      deleteSession(sessionId);
      toast.success('Session supprimée');
    }
  };

  const handleSync = async () => {
    try {
      await syncToSupabase();
      toast.success('Synchronisation terminée!');
    } catch (error) {
      toast.error('Erreur de synchronisation');
    }
  };

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-800">Sessions</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSync}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
          >
            Sync
          </button>
          <button
            onClick={() => setShowSessions(!showSessions)}
            className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-slate-600 hover:to-slate-700 transition-all duration-300"
          >
            {showSessions ? 'Masquer' : 'Afficher'} ({sessions.length})
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
          >
            Nouvelle Session
          </button>
        </div>
      </div>

      {currentSession && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">{currentSession.name}</h4>
              <p className="text-sm text-blue-700">
                {currentSession.events.length} activités • 
                Créée le {new Date(currentSession.createdAt).toLocaleDateString('fr-FR')}
              </p>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  currentSession.status === 'active' ? 'bg-green-100 text-green-800' :
                  currentSession.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {currentSession.status === 'active' ? 'Active' : 
                   currentSession.status === 'completed' ? 'Terminée' : 'Brouillon'}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleExport(currentSession.id)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Exporter
            </button>
          </div>
        </div>
      )}

      {showSessions && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {sessions.length === 0 ? (
            <p className="text-center text-slate-500 py-8">Aucune session enregistrée</p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  session.id === currentSessionId
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                    : 'bg-white/40 border-white/20 hover:bg-white/60'
                }`}
              >
                <div className="flex-1">
                  <h4 className="font-medium">{session.name}</h4>
                  <p className="text-sm text-slate-500">
                    {session.events.length} activités • 
                    {new Date(session.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    session.status === 'active' ? 'bg-green-100 text-green-800' :
                    session.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {session.status === 'active' ? 'Active' : 
                     session.status === 'completed' ? 'Terminée' : 'Brouillon'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {session.id !== currentSessionId && (
                    <button
                      onClick={() => loadSession(session.id)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Charger
                    </button>
                  )}
                  <button
                    onClick={() => handleExport(session.id)}
                    className="text-sm text-green-600 hover:text-green-800 font-medium"
                  >
                    Export
                  </button>
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Suppr.
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between">
        <label className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:from-slate-600 hover:to-slate-700 transition-all duration-300">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          Importer Session
        </label>
      </div>

      {/* Modal pour créer une nouvelle session */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Nouvelle Session</h3>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Nom de la session"
              className="w-full p-3 border border-slate-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-slate-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-600 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateSession}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                disabled={!sessionName.trim()}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};