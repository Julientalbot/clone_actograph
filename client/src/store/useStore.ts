import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { openDB } from 'idb';

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
  sessionId: string;
}

interface Session {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  events: ActivityEvent[];
  videoUrl?: string;
  notes?: string;
}

interface AppState {
  // Current session
  currentSessionId: string | null;
  sessions: Session[];
  
  // Timer state
  isTimerRunning: boolean;
  timerElapsedTime: number;
  timerStartTime: number | null;
  
  // Activities
  activities: Activity[];
  currentActivityId: string | null;
  
  // Actions
  createSession: (name: string) => void;
  loadSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  updateSessionVideo: (videoUrl: string) => void;
  updateSessionNotes: (notes: string) => void;
  
  // Timer actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  updateTimerElapsed: (elapsed: number) => void;
  
  // Activity actions
  logActivity: (activityId: string) => void;
  exportSession: (sessionId: string) => Promise<string>;
  importSession: (data: string) => Promise<void>;
}

const defaultActivities: Activity[] = [
  { id: '1', name: 'Préparation', color: 'bg-gradient-to-r from-blue-500 to-blue-600', description: 'Préparation du poste' },
  { id: '2', name: 'Travail principal', color: 'bg-gradient-to-r from-emerald-500 to-green-600', description: 'Activité principale' },
  { id: '3', name: 'Pause', color: 'bg-gradient-to-r from-amber-400 to-yellow-500', description: 'Pause/Arrêt' },
  { id: '4', name: 'Attente', color: 'bg-gradient-to-r from-red-500 to-red-600', description: 'Attente/Blocage' },
  { id: '5', name: 'Communication', color: 'bg-gradient-to-r from-purple-500 to-violet-600', description: 'Discussion/Échange' },
];

// IndexedDB helper
const getDB = async () => {
  return openDB('ActoGraphDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('sessions')) {
        db.createObjectStore('sessions', { keyPath: 'id' });
      }
    },
  });
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSessionId: null,
      sessions: [],
      isTimerRunning: false,
      timerElapsedTime: 0,
      timerStartTime: null,
      activities: defaultActivities,
      currentActivityId: null,

      // Session actions
      createSession: (name: string) => {
        const newSession: Session = {
          id: Date.now().toString(),
          name,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          events: [],
        };
        
        set((state) => ({
          sessions: [...state.sessions, newSession],
          currentSessionId: newSession.id,
        }));
        
        // Save to IndexedDB
        getDB().then(db => db.put('sessions', newSession));
      },

      loadSession: (sessionId: string) => {
        set({ currentSessionId: sessionId });
      },

      deleteSession: async (sessionId: string) => {
        set((state) => ({
          sessions: state.sessions.filter(s => s.id !== sessionId),
          currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId,
        }));
        
        const db = await getDB();
        await db.delete('sessions', sessionId);
      },

      updateSessionVideo: (videoUrl: string) => {
        set((state) => {
          const sessions = state.sessions.map(s => 
            s.id === state.currentSessionId 
              ? { ...s, videoUrl, updatedAt: Date.now() }
              : s
          );
          return { sessions };
        });
      },

      updateSessionNotes: (notes: string) => {
        set((state) => {
          const sessions = state.sessions.map(s => 
            s.id === state.currentSessionId 
              ? { ...s, notes, updatedAt: Date.now() }
              : s
          );
          return { sessions };
        });
      },

      // Timer actions
      startTimer: () => {
        const now = Date.now();
        set((state) => ({
          isTimerRunning: true,
          timerStartTime: now - state.timerElapsedTime,
        }));
      },

      pauseTimer: () => {
        set({ isTimerRunning: false });
      },

      resetTimer: () => {
        set({
          isTimerRunning: false,
          timerElapsedTime: 0,
          timerStartTime: null,
        });
      },

      updateTimerElapsed: (elapsed: number) => {
        set({ timerElapsedTime: elapsed });
      },

      // Activity actions
      logActivity: (activityId: string) => {
        const state = get();
        const activity = state.activities.find(a => a.id === activityId);
        if (!activity || !state.currentSessionId) return;

        const now = Date.now();
        
        set((state) => {
          const sessions = state.sessions.map(session => {
            if (session.id !== state.currentSessionId) return session;
            
            const updatedEvents = [...session.events];
            
            // Finish current activity if exists
            if (state.currentActivityId) {
              const lastEventIndex = updatedEvents.findIndex(e => e.id === state.currentActivityId);
              if (lastEventIndex !== -1 && !updatedEvents[lastEventIndex].duration) {
                updatedEvents[lastEventIndex] = {
                  ...updatedEvents[lastEventIndex],
                  duration: now - updatedEvents[lastEventIndex].timestamp,
                };
              }
            }
            
            // Add new activity
            const newEvent: ActivityEvent = {
              id: Date.now().toString(),
              activityId: activity.id,
              activityName: activity.name,
              timestamp: now,
              sessionId: session.id,
            };
            
            return {
              ...session,
              events: [...updatedEvents, newEvent],
              updatedAt: now,
            };
          });
          
          return {
            sessions,
            currentActivityId: Date.now().toString(),
          };
        });
      },

      // Export/Import
      exportSession: async (sessionId: string) => {
        const session = get().sessions.find(s => s.id === sessionId);
        if (!session) throw new Error('Session not found');
        
        return JSON.stringify(session, null, 2);
      },

      importSession: async (data: string) => {
        try {
          const session = JSON.parse(data) as Session;
          session.id = Date.now().toString(); // New ID
          session.createdAt = Date.now();
          session.updatedAt = Date.now();
          
          set((state) => ({
            sessions: [...state.sessions, session],
          }));
          
          const db = await getDB();
          await db.put('sessions', session);
        } catch (error) {
          throw new Error('Invalid session data');
        }
      },
    }),
    {
      name: 'actograph-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessions: state.sessions,
        activities: state.activities,
      }),
    }
  )
);