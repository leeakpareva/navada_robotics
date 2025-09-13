// Chat Analytics System
export interface ChatSession {
  id: string;
  threadId?: string;
  startTime: Date;
  endTime?: Date;
  messageCount: number;
  responseTime: number; // in milliseconds
  userSatisfaction?: number; // 1-5 rating
  topic?: string;
  status: 'active' | 'completed' | 'error';
}

export interface ChatMetrics {
  chatVolume: { time: string; value: number }[];
  responseTimeData: { time: string; value: number }[];
  activeUsers: {
    current: number;
    thisHour: number;
    today: number;
  };
  satisfaction: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
  dailyQueries: number;
  uptime: number;
  accuracy: number;
}

// In-memory storage (in production, use a database)
let chatSessions: ChatSession[] = [];
let dailyMetrics: { date: string; queries: number; uptime: number }[] = [];

// Initialize with some sample data for demonstration
function initializeWithSampleData() {
  const now = new Date();
  const hoursAgo = Array.from({ length: 24 }, (_, i) => {
    const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    return {
      hour: time.getHours(),
      time: time.toTimeString().slice(0, 5),
      sessions: Math.floor(Math.random() * 50) + 10
    };
  });

  // Generate sample chat sessions for the last 24 hours
  hoursAgo.forEach(({ time, sessions, hour }) => {
    for (let j = 0; j < sessions; j++) {
      const sessionTime = new Date(now.getTime() - (23 - hour) * 60 * 60 * 1000 + Math.random() * 60 * 60 * 1000);
      const responseTime = Math.random() * 3000 + 500; // 0.5-3.5 seconds
      const satisfaction = Math.floor(Math.random() * 5) + 1;

      chatSessions.push({
        id: `session_${Date.now()}_${j}_${hour}`,
        startTime: sessionTime,
        endTime: new Date(sessionTime.getTime() + Math.random() * 30 * 60 * 1000),
        messageCount: Math.floor(Math.random() * 10) + 1,
        responseTime,
        userSatisfaction: satisfaction,
        topic: ['robotics', 'python', 'computer vision', 'deep learning', 'raspberry pi'][Math.floor(Math.random() * 5)],
        status: 'completed'
      });
    }
  });
}

// Initialize sample data on first load
if (chatSessions.length === 0) {
  initializeWithSampleData();
}

export function trackChatSession(session: Omit<ChatSession, 'id'>) {
  const newSession: ChatSession = {
    ...session,
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };

  chatSessions.push(newSession);

  // Keep only last 1000 sessions to prevent memory bloat
  if (chatSessions.length > 1000) {
    chatSessions = chatSessions.slice(-1000);
  }

  return newSession.id;
}

export function updateChatSession(sessionId: string, updates: Partial<ChatSession>) {
  const index = chatSessions.findIndex(session => session.id === sessionId);
  if (index !== -1) {
    chatSessions[index] = { ...chatSessions[index], ...updates };
  }
}

export function getChatMetrics(): ChatMetrics {
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

  // Filter sessions from last 24 hours
  const recentSessions = chatSessions.filter(session =>
    session.startTime >= last24Hours
  );

  // Chat Volume (hourly for last 24 hours)
  const chatVolume = Array.from({ length: 24 }, (_, i) => {
    const hourStart = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
    const hourSessions = recentSessions.filter(session =>
      session.startTime >= hourStart && session.startTime < hourEnd
    );

    return {
      time: hourStart.toTimeString().slice(0, 5),
      value: hourSessions.length
    };
  });

  // Response Time Data (last 6 data points, 4-hour intervals)
  const responseTimeData = Array.from({ length: 6 }, (_, i) => {
    const intervalStart = new Date(now.getTime() - (5 - i) * 4 * 60 * 60 * 1000);
    const intervalEnd = new Date(intervalStart.getTime() + 4 * 60 * 60 * 1000);
    const intervalSessions = recentSessions.filter(session =>
      session.startTime >= intervalStart && session.startTime < intervalEnd && session.responseTime
    );

    const avgResponseTime = intervalSessions.length > 0
      ? intervalSessions.reduce((sum, session) => sum + session.responseTime, 0) / intervalSessions.length / 1000
      : 0;

    return {
      time: intervalStart.toTimeString().slice(0, 5),
      value: Math.round(avgResponseTime * 10) / 10 // Round to 1 decimal
    };
  });

  // Active Users
  const activeSessions = recentSessions.filter(session => session.status === 'active');
  const hourSessions = recentSessions.filter(session => session.startTime >= lastHour);

  const activeUsers = {
    current: activeSessions.length,
    thisHour: hourSessions.length,
    today: recentSessions.length
  };

  // User Satisfaction
  const satisfactionSessions = recentSessions.filter(session => session.userSatisfaction);
  const totalSatisfactionSessions = satisfactionSessions.length;

  const satisfaction = {
    excellent: totalSatisfactionSessions > 0
      ? Math.round((satisfactionSessions.filter(s => s.userSatisfaction === 5).length / totalSatisfactionSessions) * 100)
      : 45,
    good: totalSatisfactionSessions > 0
      ? Math.round((satisfactionSessions.filter(s => s.userSatisfaction === 4).length / totalSatisfactionSessions) * 100)
      : 32,
    fair: totalSatisfactionSessions > 0
      ? Math.round((satisfactionSessions.filter(s => s.userSatisfaction === 3).length / totalSatisfactionSessions) * 100)
      : 18,
    poor: totalSatisfactionSessions > 0
      ? Math.round((satisfactionSessions.filter(s => s.userSatisfaction! <= 2).length / totalSatisfactionSessions) * 100)
      : 5
  };

  // Daily Queries
  const dailyQueries = recentSessions.reduce((sum, session) => sum + session.messageCount, 0);

  // Uptime (mock - in production would track actual server uptime)
  const uptime = 99.9;

  // Accuracy (mock - in production would track actual response accuracy)
  const accuracy = 92;

  return {
    chatVolume,
    responseTimeData,
    activeUsers,
    satisfaction,
    dailyQueries,
    uptime,
    accuracy
  };
}

// Helper function to get current analytics for display
export function getCurrentAnalytics() {
  const metrics = getChatMetrics();
  const totalSessions = chatSessions.length;
  const avgResponseTime = chatSessions.length > 0
    ? chatSessions.filter(s => s.responseTime).reduce((sum, s) => sum + s.responseTime, 0) / chatSessions.filter(s => s.responseTime).length / 1000
    : 1.8;

  return {
    ...metrics,
    totalSessions,
    avgResponseTime: Math.round(avgResponseTime * 10) / 10
  };
}