import { create } from 'zustand';

export type Meditation = {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  topicId: string;
  illustration: string;
  audioFile?: string;
  isCompleted?: boolean;
  completedAt?: number;
};

export type MeditationTopic = {
  id: string;
  title: string;
  description: string;
  color: string;
  illustration: string;
  categories: string[];
};

export type DailyQuote = {
  text: string;
  author: string;
};

export type MeditationSession = {
  id: string;
  meditationId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  isCompleted: boolean;
};

type MeditationStore = {
  // State
  meditations: Meditation[];
  topics: MeditationTopic[];
  dailyQuotes: DailyQuote[];
  sessions: MeditationSession[];
  currentSession?: MeditationSession;
  
  // Actions
  addMeditation: (meditation: Omit<Meditation, 'id'>) => void;
  updateMeditation: (id: string, updates: Partial<Meditation>) => void;
  deleteMeditation: (id: string) => void;
  
  addTopic: (topic: Omit<MeditationTopic, 'id'>) => void;
  updateTopic: (id: string, updates: Partial<MeditationTopic>) => void;
  
  startSession: (meditationId: string) => void;
  endSession: (sessionId: string) => void;
  getSessionsForMeditation: (meditationId: string) => MeditationSession[];
  getTotalSessions: () => number;
  getTotalMinutes: () => number;
  
  getDailyQuote: () => DailyQuote;
  getMeditationsForTopic: (topicId: string) => Meditation[];
  getMeditationsForCategory: (category: string) => Meditation[];
};

export const useMeditationStore = create<MeditationStore>((set, get) => ({
  // Initial state
  meditations: [
    // Sleep meditations
    {
      id: '1',
      title: 'Getting back to sleep',
      description: 'This session is designed to help you get back to sleep if you\'ve woken up in the middle of the night.',
      duration: '17 min',
      category: 'Meditation for sleep',
      topicId: '1',
      illustration: '😴'
    },
    {
      id: '2',
      title: 'Deep sleep meditation',
      description: 'A guided meditation to help you fall into a deep, restful sleep.',
      duration: '25 min',
      category: 'Meditation for sleep',
      topicId: '1',
      illustration: '🌙'
    },
    {
      id: '3',
      title: 'Sleep story: Forest walk',
      description: 'A calming story about walking through a peaceful forest at night.',
      duration: '30 min',
      category: 'Sleep stories',
      topicId: '1',
      illustration: '🌲'
    },
    {
      id: '4',
      title: 'Ocean waves',
      description: 'Relaxing sounds of ocean waves to help you drift off.',
      duration: '45 min',
      category: 'Nature sounds',
      topicId: '1',
      illustration: '🌊'
    },
    // Student meditations
    {
      id: '5',
      title: 'Study focus meditation',
      description: 'Improve your concentration and focus while studying.',
      duration: '15 min',
      category: 'Study focus',
      topicId: '2',
      illustration: '📖'
    },
    {
      id: '6',
      title: 'Exam anxiety relief',
      description: 'Calm your nerves before important exams and tests.',
      duration: '10 min',
      category: 'Exam anxiety',
      topicId: '2',
      illustration: '📝'
    },
    {
      id: '7',
      title: 'Learning mindfulness',
      description: 'Develop mindful awareness while learning new concepts.',
      duration: '20 min',
      category: 'Learning mindfulness',
      topicId: '2',
      illustration: '🧠'
    },
    // Life meditations
    {
      id: '8',
      title: 'Life transitions',
      description: 'Navigate major life changes with mindfulness and grace.',
      duration: '22 min',
      category: 'Life transitions',
      topicId: '3',
      illustration: '🔄'
    },
    {
      id: '9',
      title: 'Finding your purpose',
      description: 'Explore your life\'s purpose through mindful reflection.',
      duration: '18 min',
      category: 'Life purpose',
      topicId: '3',
      illustration: '🎯'
    },
    // Crisis meditations
    {
      id: '10',
      title: 'Crisis management',
      description: 'Stay centered during challenging times and uncertainty.',
      duration: '20 min',
      category: 'Crisis management',
      topicId: '4',
      illustration: '🤝'
    },
    {
      id: '11',
      title: 'Community support',
      description: 'Build resilience and support others in your community.',
      duration: '25 min',
      category: 'Community support',
      topicId: '4',
      illustration: '👥'
    },
    // Active meditations
    {
      id: '12',
      title: 'Exercise mindfulness',
      description: 'Bring awareness to your physical activity and movement.',
      duration: '15 min',
      category: 'Exercise mindfulness',
      topicId: '5',
      illustration: '🏃'
    },
    {
      id: '13',
      title: 'Active recovery',
      description: 'Mindful recovery after physical activity.',
      duration: '12 min',
      category: 'Active recovery',
      topicId: '5',
      illustration: '🧘'
    },
    // Community meditations
    {
      id: '14',
      title: 'Community session',
      description: 'Join a guided meditation with the community.',
      duration: '30 min',
      category: 'Community sessions',
      topicId: '6',
      illustration: '👥'
    },
    {
      id: '15',
      title: 'Shared experiences',
      description: 'Connect with others through shared meditation experiences.',
      duration: '20 min',
      category: 'Shared experiences',
      topicId: '6',
      illustration: '💫'
    }
  ],
  
  topics: [
    {
      id: '1',
      title: 'Sleep',
      description: 'Get a peaceful night\'s rest',
      color: '#4A90E2',
      illustration: '🌙',
      categories: ['Meditation for sleep', 'Sleep stories', 'Meditative music', 'Nature sounds']
    },
    {
      id: '2',
      title: 'Students',
      description: 'Bring mindfulness to your studies',
      color: '#F5A623',
      illustration: '📚',
      categories: ['Study focus', 'Exam anxiety', 'Learning mindfulness', 'Academic stress']
    },
    {
      id: '3',
      title: 'Life',
      description: 'Navigate life\'s journey with mindfulness',
      color: '#7ED321',
      illustration: '🌱',
      categories: ['Life transitions', 'Personal growth', 'Life purpose', 'Daily mindfulness']
    },
    {
      id: '4',
      title: 'Societal Crisis',
      description: 'Coping in times of crisis',
      color: '#D0021B',
      illustration: '🤝',
      categories: ['Crisis management', 'Community support', 'Resilience building', 'Social anxiety']
    },
    {
      id: '5',
      title: 'Getting Active',
      description: 'Mindful Steps Toward a Fitter You',
      color: '#50E3C2',
      illustration: '🏃',
      categories: ['Exercise mindfulness', 'Sports meditation', 'Active recovery', 'Movement awareness']
    },
    {
      id: '6',
      title: 'Friends of Medito',
      description: 'Community-guided meditations',
      color: '#BD10E0',
      illustration: '👥',
      categories: ['Community sessions', 'Group meditation', 'Shared experiences', 'Social mindfulness']
    }
  ],
  
  dailyQuotes: [
    {
      text: "Sometimes the most important thing in a whole day is the rest we take between two deep breaths.",
      author: "Etty Hillesum"
    },
    {
      text: "The present moment is the only time over which we have dominion.",
      author: "Thích Nhất Hạnh"
    },
    {
      text: "Peace comes from within. Do not seek it without.",
      author: "Buddha"
    },
    {
      text: "Mindfulness is about being fully awake in our lives.",
      author: "Jon Kabat-Zinn"
    },
    {
      text: "The mind is everything. What you think you become.",
      author: "Buddha"
    },
    {
      text: "Meditation is not about stopping thoughts, but recognizing that you are not your thoughts.",
      author: "Jon Kabat-Zinn"
    },
    {
      text: "The best way to take care of the future is to take care of the present moment.",
      author: "Thích Nhất Hạnh"
    }
  ],
  
  sessions: [],
  currentSession: undefined,
  
  // Actions
  addMeditation: (meditation) => set((state) => ({
    meditations: [
      ...state.meditations,
      {
        ...meditation,
        id: Date.now().toString(),
      }
    ]
  })),
  
  updateMeditation: (id, updates) => set((state) => ({
    meditations: state.meditations.map((meditation) =>
      meditation.id === id ? { ...meditation, ...updates } : meditation
    )
  })),
  
  deleteMeditation: (id) => set((state) => ({
    meditations: state.meditations.filter((meditation) => meditation.id !== id)
  })),
  
  addTopic: (topic) => set((state) => ({
    topics: [
      ...state.topics,
      {
        ...topic,
        id: Date.now().toString(),
      }
    ]
  })),
  
  updateTopic: (id, updates) => set((state) => ({
    topics: state.topics.map((topic) =>
      topic.id === id ? { ...topic, ...updates } : topic
    )
  })),
  
  startSession: (meditationId) => {
    const session: MeditationSession = {
      id: Date.now().toString(),
      meditationId,
      startTime: Date.now(),
      isCompleted: false,
    };
    
    set((state) => ({
      sessions: [...state.sessions, session],
      currentSession: session,
    }));
  },
  
  endSession: (sessionId) => {
    const endTime = Date.now();
    
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              endTime,
              duration: endTime - session.startTime,
              isCompleted: true,
            }
          : session
      ),
      currentSession: undefined,
    }));
  },
  
  getSessionsForMeditation: (meditationId) => {
    const { sessions } = get();
    return sessions.filter((session) => session.meditationId === meditationId);
  },
  
  getTotalSessions: () => {
    const { sessions } = get();
    return sessions.filter((session) => session.isCompleted).length;
  },
  
  getTotalMinutes: () => {
    const { sessions } = get();
    return sessions
      .filter((session) => session.isCompleted && session.duration)
      .reduce((total, session) => total + Math.floor(session.duration! / 60000), 0);
  },
  
  getDailyQuote: () => {
    const { dailyQuotes } = get();
    const today = new Date().getDate();
    return dailyQuotes[today % dailyQuotes.length];
  },
  
  getMeditationsForTopic: (topicId) => {
    const { meditations } = get();
    return meditations.filter((meditation) => meditation.topicId === topicId);
  },
  
  getMeditationsForCategory: (category) => {
    const { meditations } = get();
    return meditations.filter((meditation) => meditation.category === category);
  },
}));
