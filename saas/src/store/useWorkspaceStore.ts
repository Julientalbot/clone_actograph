import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

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
  notes?: string;
}

interface Session {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  events: ActivityEvent[];
  videoUrl?: string;
  notes?: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
}

interface WorkspaceState {
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
  
  // Loading states
  loading: boolean;
  
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
  
  // Supabase sync
  syncToSupabase: () => Promise<void>;
  loadFromSupabase: () => Promise<void>;
}

const defaultActivities: Activity[] = [
  { id: '1', name: 'Préparation', color: 'bg-gradient-to-r from-blue-500 to-blue-600', description: 'Préparation du poste' },
  { id: '2', name: 'Travail principal', color: 'bg-gradient-to-r from-emerald-500 to-green-600', description: 'Activité principale' },
  { id: '3', name: 'Pause', color: 'bg-gradient-to-r from-amber-400 to-yellow-500', description: 'Pause/Arrêt' },
  { id: '4', name: 'Attente', color: 'bg-gradient-to-r from-red-500 to-red-600', description: 'Attente/Blocage' },
  { id: '5', name: 'Communication', color: 'bg-gradient-to-r from-purple-500 to-violet-600', description: 'Discussion/Échange' },
];

export const useWorkspaceStore = create<WorkspaceState>()(
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
      loading: false,

      // Session actions
      createSession: (name: string) => {
        const newSession: Session = {
          id: Date.now().toString(),
          name,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          events: [],
          status: 'draft',
        };
        
        set((state) => ({
          sessions: [...state.sessions, newSession],
          currentSessionId: newSession.id,
        }));

        // Sync to Supabase
        get().syncToSupabase();
      },

      loadSession: (sessionId: string) => {
        set({ 
          currentSessionId: sessionId,
          isTimerRunning: false,
          timerElapsedTime: 0,
          timerStartTime: null,
          currentActivityId: null,
        });
      },

      deleteSession: (sessionId: string) => {
        set((state) => ({
          sessions: state.sessions.filter(s => s.id !== sessionId),
          currentSessionId: state.currentSessionId === sessionId ? 
            (state.sessions.length > 1 ? state.sessions.find(s => s.id !== sessionId)?.id || null : null) : 
            state.currentSessionId,
        }));

        // Sync to Supabase
        get().syncToSupabase();
      },

      updateSessionVideo: (videoUrl: string) => {
        const { currentSessionId } = get();
        if (!currentSessionId) return;

        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === currentSessionId
              ? { ...session, videoUrl, updatedAt: Date.now() }
              : session
          ),
        }));

        // Sync to Supabase
        get().syncToSupabase();
      },

      updateSessionNotes: (notes: string) => {
        const { currentSessionId } = get();
        if (!currentSessionId) return;

        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === currentSessionId
              ? { ...session, notes, updatedAt: Date.now() }
              : session
          ),
        }));

        // Sync to Supabase
        get().syncToSupabase();
      },

      // Timer actions
      startTimer: () => {
        set({
          isTimerRunning: true,
          timerStartTime: Date.now(),
        });
      },

      pauseTimer: () => {
        const { currentActivityId, timerElapsedTime, currentSessionId } = get();
        
        if (currentActivityId && currentSessionId) {
          // Complete the current activity
          set((state) => {
            const updatedSessions = state.sessions.map(session => {
              if (session.id === currentSessionId) {
                const updatedEvents = session.events.map(event =>
                  event.id === currentActivityId && !event.duration
                    ? { ...event, duration: timerElapsedTime }
                    : event
                );
                return { ...session, events: updatedEvents, updatedAt: Date.now() };
              }
              return session;
            });
            
            return {
              sessions: updatedSessions,
              isTimerRunning: false,
              currentActivityId: null,
            };
          });

          // Sync to Supabase
          get().syncToSupabase();
        } else {
          set({ isTimerRunning: false });
        }
      },

      resetTimer: () => {
        set({
          isTimerRunning: false,
          timerElapsedTime: 0,
          timerStartTime: null,
          currentActivityId: null,
        });
      },

      updateTimerElapsed: (elapsed: number) => {
        set({ timerElapsedTime: elapsed });
      },

      // Activity actions
      logActivity: (activityId: string) => {
        const { activities, currentSessionId, isTimerRunning, pauseTimer } = get();
        
        if (!currentSessionId) return;

        // If timer is running, pause it to complete the current activity
        if (isTimerRunning) {
          pauseTimer();
        }

        const activity = activities.find(a => a.id === activityId);
        if (!activity) return;

        const eventId = Date.now().toString();
        const newEvent: ActivityEvent = {
          id: eventId,
          activityId,
          activityName: activity.name,
          timestamp: Date.now(),
          sessionId: currentSessionId,
        };

        set((state) => ({
          sessions: state.sessions.map(session =>
            session.id === currentSessionId
              ? { ...session, events: [...session.events, newEvent], updatedAt: Date.now() }
              : session
          ),
          currentActivityId: eventId,
          timerElapsedTime: 0,
          timerStartTime: Date.now(),
          isTimerRunning: true,
        }));

        // Sync to Supabase
        get().syncToSupabase();
      },

      exportSession: async (sessionId: string): Promise<string> => {
        const { sessions } = get();
        const session = sessions.find(s => s.id === sessionId);
        
        if (!session) {
          throw new Error('Session not found');
        }

        return JSON.stringify({
          version: '1.0',
          exportDate: new Date().toISOString(),
          session,
        }, null, 2);
      },

      importSession: async (data: string): Promise<void> => {
        try {
          const parsed = JSON.parse(data);
          const session: Session = parsed.session;
          
          // Generate new ID to avoid conflicts
          const importedSession: Session = {
            ...session,
            id: Date.now().toString(),
            name: `${session.name} (importée)`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          set((state) => ({
            sessions: [...state.sessions, importedSession],
          }));

          // Sync to Supabase
          get().syncToSupabase();
        } catch (error) {
          throw new Error('Invalid session data');
        }
      },

      // Supabase sync
      syncToSupabase: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { currentSessionId, sessions } = get();
          
          // Find the current session
          const currentSession = sessions.find(s => s.id === currentSessionId);
          if (!currentSession) return;

          // Update or insert session in Supabase
          const sessionData = {
            name: currentSession.name,
            description: currentSession.notes,
            user_id: user.id,
            organization_id: user.user_metadata?.organization_id,
            status: currentSession.status,
            video_url: currentSession.videoUrl,
            metadata: {
              events: currentSession.events,
              localId: currentSession.id,
              createdAt: currentSession.createdAt,
              updatedAt: currentSession.updatedAt,
            },
          };

          const { error } = await supabase
            .from('sessions')
            .upsert(sessionData);

          if (error) {
            console.error('Error syncing to Supabase:', error);
          }
        } catch (error) {
          console.error('Error in syncToSupabase:', error);
        }
      },

      loadFromSupabase: async () => {
        try {
          set({ loading: true });
          
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data: sessions, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

          if (error) {
            console.error('Error loading from Supabase:', error);
            return;
          }

          if (sessions && sessions.length > 0) {
            const localSessions: Session[] = sessions.map(session => ({
              id: session.metadata?.localId || session.id,
              name: session.name,
              createdAt: session.metadata?.createdAt || Date.parse(session.created_at),
              updatedAt: session.metadata?.updatedAt || Date.parse(session.updated_at),
              events: session.metadata?.events || [],
              videoUrl: session.video_url,
              notes: session.description,
              status: session.status,
            }));

            set({
              sessions: localSessions,
              currentSessionId: localSessions[0]?.id || null,
            });
          }
        } catch (error) {
          console.error('Error in loadFromSupabase:', error);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'actograph-workspace-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessions: state.sessions,
        currentSessionId: state.currentSessionId,
        activities: state.activities,
      }),
    }
  )
);