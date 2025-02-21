import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: Date;
}

interface Level {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  perks: string[];
}

interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  points: number;
  level: number;
  achievements: Achievement[];
  streak: number;
  lastActive: Date;
}

interface Project {
  id: string;
  name: string;
  lastModified: Date;
  wallpaper?: string;
  collaborators?: string[];
}

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  lastModified: Date;
  size: number;
  shared: boolean;
}

interface CalendarConnection {
  provider: 'google' | 'outlook' | null;
  connected: boolean;
  email?: string;
}

interface StoreState {
  // View Management
  currentView: string;
  viewHistory: string[];
  viewParams: Record<string, any>;
  setView: (view: string, params?: Record<string, any>) => void;
  goBack: () => void;

  // Theme
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;

  // User Interface
  hasSeenWalkthrough: boolean;
  setHasSeenWalkthrough: (seen: boolean) => void;
  customWallpaper: string | null;
  setCustomWallpaper: (wallpaper: string | null) => void;

  // User & Authentication
  user: User | null;
  setUser: (user: User | null) => void;
  isOwner: boolean;

  // Projects & Content
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  selectedProject: string | null;
  setSelectedProject: (projectId: string | null) => void;
  projectName: string;
  setProjectName: (name: string) => void;

  // Templates
  templates: Template[];
  setTemplates: (templates: Template[]) => void;

  // Documents
  documents: Document[];
  recentFiles: string[];
  setRecentFiles: (files: string[]) => void;

  // Tokens & Usage
  tokensRemaining: number;
  setTokensRemaining: (tokens: number) => void;
  lastTokenUse: {
    amount: number;
    timestamp: number;
  } | null;
  setLastTokenUse: (tokenUse: { amount: number; timestamp: number } | null) => void;
  useTokens: (amount: number) => void;

  // Calendar
  calendarConnection: CalendarConnection;
  setCalendarConnection: (connection: CalendarConnection) => void;

  // Gamification
  achievements: Achievement[];
  levels: Level[];
  dailyGoals: {
    tokensUsed: number;
    projectsCreated: number;
    reportsGenerated: number;
  };
  addPoints: (points: number, reason: string) => void;
  unlockAchievement: (achievementId: string) => void;
  updateDailyGoals: (goals: Partial<StoreState['dailyGoals']>) => void;
  incrementStreak: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // View Management
      currentView: 'welcome',
      viewHistory: ['welcome'],
      viewParams: {},
      setView: (view, params = {}) => set(state => ({
        currentView: view,
        viewHistory: [...state.viewHistory, view],
        viewParams: params
      })),
      goBack: () => set(state => {
        const newHistory = [...state.viewHistory];
        newHistory.pop(); // Remove current view
        const previousView = newHistory[newHistory.length - 1] || 'welcome';
        return {
          currentView: previousView,
          viewHistory: newHistory,
          viewParams: {}
        };
      }),

      // Theme
      darkMode: false,
      setDarkMode: (darkMode) => set({ darkMode }),

      // User Interface
      hasSeenWalkthrough: false,
      setHasSeenWalkthrough: (seen) => set({ hasSeenWalkthrough: seen }),
      customWallpaper: null,
      setCustomWallpaper: (wallpaper) => set({ customWallpaper: wallpaper }),

      // User & Authentication
      user: null,
      setUser: (user) => set({ user }),
      isOwner: true,

      // Projects & Content
      projects: [],
      setProjects: (projects) => set({ projects }),
      selectedProject: null,
      setSelectedProject: (projectId) => set({ selectedProject: projectId }),
      projectName: '',
      setProjectName: (name) => set({ projectName: name }),

      // Templates
      templates: [],
      setTemplates: (templates) => set({ templates }),

      // Documents
      documents: [],
      recentFiles: [],
      setRecentFiles: (files) => set({ recentFiles: files }),

      // Tokens & Usage
      tokensRemaining: 75000,
      setTokensRemaining: (tokens) => set({ tokensRemaining: tokens }),
      lastTokenUse: null,
      setLastTokenUse: (tokenUse) => set({ lastTokenUse: tokenUse }),
      useTokens: (amount) => {
        const state = get();
        set({
          tokensRemaining: state.tokensRemaining - amount,
          lastTokenUse: {
            amount,
            timestamp: Date.now(),
          },
          dailyGoals: {
            ...state.dailyGoals,
            tokensUsed: state.dailyGoals.tokensUsed + amount
          }
        });
        
        // Check token-related achievements
        if (state.dailyGoals.tokensUsed >= 100000) {
          get().unlockAchievement('token-master');
        }
      },

      // Calendar
      calendarConnection: {
        provider: null,
        connected: false,
      },
      setCalendarConnection: (connection) => set({ calendarConnection: connection }),

      // Gamification
      achievements: [],
      levels: [],
      dailyGoals: {
        tokensUsed: 0,
        projectsCreated: 0,
        reportsGenerated: 0
      },
      addPoints: (points, reason) => {
        const state = get();
        if (!state.user) return;

        const newPoints = state.user.points + points;
        const newLevel = state.levels.findIndex(level => 
          newPoints >= level.minPoints && newPoints <= level.maxPoints
        ) + 1;

        set({
          user: {
            ...state.user,
            points: newPoints,
            level: newLevel
          }
        });
      },
      unlockAchievement: (achievementId) => {
        const state = get();
        if (!state.user) return;

        const achievement = state.achievements.find(a => a.id === achievementId);
        if (!achievement || state.user.achievements.some(a => a.id === achievementId)) return;

        const updatedAchievements = [
          ...state.user.achievements,
          { ...achievement, unlockedAt: new Date() }
        ];

        set({
          user: {
            ...state.user,
            achievements: updatedAchievements
          }
        });

        // Add achievement points
        get().addPoints(achievement.points, `Unlocked achievement: ${achievement.title}`);
      },
      updateDailyGoals: (goals) => {
        const state = get();
        set({
          dailyGoals: {
            ...state.dailyGoals,
            ...goals
          }
        });

        // Check achievements based on goals
        if (goals.projectsCreated && goals.projectsCreated === 1) {
          get().unlockAchievement('first-project');
        }
        if (goals.reportsGenerated && goals.reportsGenerated >= 10) {
          get().unlockAchievement('data-explorer');
        }
      },
      incrementStreak: () => {
        const state = get();
        if (!state.user) return;

        const today = new Date();
        const lastActive = new Date(state.user.lastActive);
        const daysSinceLastActive = Math.floor(
          (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
        );

        let newStreak = state.user.streak;
        if (daysSinceLastActive === 1) {
          newStreak += 1;
        } else if (daysSinceLastActive > 1) {
          newStreak = 1;
        }

        set({
          user: {
            ...state.user,
            streak: newStreak,
            lastActive: today
          }
        });

        // Check streak achievement
        if (newStreak >= 7) {
          get().unlockAchievement('streak-warrior');
        }
      }
    }),
    {
      name: 'app-storage',
    }
  )
);