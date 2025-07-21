'use client';

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import toast from 'react-hot-toast';

export default function SessionsPage() {
  const { sessions, currentSessionId, loadSession, deleteSession, exportSession } = useWorkspaceStore();
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'activities'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSessionSelect = (sessionId: string, checked: boolean) => {
    const newSelected = new Set(selectedSessions);
    if (checked) {
      newSelected.add(sessionId);
    } else {
      newSelected.delete(sessionId);
    }
    setSelectedSessions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedSessions.size === filteredSessions.length) {
      setSelectedSessions(new Set());
    } else {
      setSelectedSessions(new Set(filteredSessions.map(s => s.id)));
    }
  };

  const handleExport = async (sessionId: string) => {
    try {
      const data = await exportSession(sessionId);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const session = sessions.find(s => s.id === sessionId);
      a.download = `actograph-${session?.name || 'session'}-${sessionId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Session exportée!');
    } catch (error) {
      toast.error('Erreur lors de l\'export');
    }
  };

  const handleBulkExport = async () => {
    if (selectedSessions.size === 0) {
      toast.error('Aucune session sélectionnée');
      return;
    }

    try {
      for (const sessionId of selectedSessions) {
        await handleExport(sessionId);
      }
      toast.success(`${selectedSessions.size} sessions exportées!`);
      setSelectedSessions(new Set());
    } catch (error) {
      toast.error('Erreur lors de l\'export groupé');
    }
  };

  const handleBulkDelete = () => {
    if (selectedSessions.size === 0) {
      toast.error('Aucune session sélectionnée');
      return;
    }

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedSessions.size} sessions?`)) {
      selectedSessions.forEach(sessionId => {
        deleteSession(sessionId);
      });
      toast.success(`${selectedSessions.size} sessions supprimées`);
      setSelectedSessions(new Set());
    }
  };

  const formatDuration = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  // Sort sessions
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = a.createdAt - b.createdAt;
        break;
      case 'activities':
        comparison = a.events.length - b.events.length;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Gestion des sessions
          </h1>
          <p className="text-xl text-slate-600">
            Organisez, exportez et analysez vos sessions d'analyse ergonomique
          </p>
        </div>
        {selectedSessions.size > 0 && (
          <div className="flex space-x-3">
            <button
              onClick={handleBulkExport}
              className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Exporter ({selectedSessions.size})</span>
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Supprimer ({selectedSessions.size})</span>
            </button>
          </div>
        )}
      </div>

      {/* Filters and Controls */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-slate-700">Statut:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="border border-slate-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes</option>
                <option value="draft">Brouillon</option>
                <option value="active">Active</option>
                <option value="completed">Terminées</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-slate-700">Trier par:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="border border-slate-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="name">Nom</option>
                <option value="activities">Activités</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 text-slate-600 hover:text-slate-900"
              >
                {sortOrder === 'asc' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="text-sm text-slate-600">
            {sortedSessions.length} session{sortedSessions.length !== 1 ? 's' : ''} 
            {filter !== 'all' && ` (${filter})`}
          </div>
        </div>
      </div>

      {/* Sessions List */}
      {sortedSessions.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 border border-white/20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Aucune session trouvée</h3>
          <p className="text-slate-600 mb-6">
            {filter === 'all' 
              ? 'Créez votre première session pour commencer l\'analyse.'
              : `Aucune session avec le statut "${filter}".`
            }
          </p>
          <a
            href="/dashboard/workspace"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Créer une session</span>
          </a>
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          {/* Table Header */}
          <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedSessions.size === sortedSessions.length && sortedSessions.length > 0}
                onChange={handleSelectAll}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1 grid grid-cols-5 gap-4 text-sm font-medium text-slate-700">
                <div>Session</div>
                <div>Statut</div>
                <div>Activités</div>
                <div>Durée</div>
                <div>Actions</div>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-200">
            {sortedSessions.map((session) => {
              const totalDuration = session.events.reduce((acc, e) => acc + (e.duration || 0), 0);
              const isSelected = selectedSessions.has(session.id);
              const isCurrent = session.id === currentSessionId;
              
              return (
                <div
                  key={session.id}
                  className={`px-6 py-4 hover:bg-slate-50/50 transition-colors ${
                    isCurrent ? 'bg-blue-50/50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSessionSelect(session.id, e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                      <div>
                        <div className="font-medium text-slate-900 flex items-center space-x-2">
                          <span>{session.name}</span>
                          {isCurrent && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Actuelle
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                          Créée le {new Date(session.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          session.status === 'active' ? 'bg-green-100 text-green-800' :
                          session.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {session.status === 'active' ? 'Active' : 
                           session.status === 'completed' ? 'Terminée' : 'Brouillon'}
                        </span>
                      </div>
                      
                      <div className="text-slate-900 font-medium">
                        {session.events.length} événement{session.events.length !== 1 ? 's' : ''}
                      </div>
                      
                      <div className="text-slate-900 font-mono">
                        {totalDuration > 0 ? formatDuration(totalDuration) : '-'}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!isCurrent && (
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
                          onClick={() => {
                            if (window.confirm('Êtes-vous sûr de vouloir supprimer cette session?')) {
                              deleteSession(session.id);
                              toast.success('Session supprimée');
                            }
                          }}
                          className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                          Suppr.
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}