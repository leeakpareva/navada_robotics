"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Menu, X, User, Brain, BookOpen, Mic, Volume2, Lock, Unlock, Eye, EyeOff,
  UserPlus, Loader2, Send, Plus, Target, Clock, Star, Code, FileText,
  Video, CheckCircle, Circle, Play, MessageSquare, Settings, Lightbulb,
  TrendingUp, Award
} from "lucide-react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': {
        'agent-id': string;
        children?: React.ReactNode;
      };
    }
  }
}

interface Tutor {
  id: string;
  name: string;
  specialization: string;
  description: string;
  personality: string;
  teachingStyle: string;
  elevenLabsAgentId: string;
  capabilities: {
    subjects: string[];
    features: string[];
  };
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  difficulty: string;
  progress: number;
  topics: string[];
  tutor: Tutor;
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    orderIndex: number;
  }>;
  resources: Array<{
    id: string;
    title: string;
    type: string;
    completed: boolean;
    orderIndex: number;
  }>;
}

interface TutorSession {
  id: string;
  tutor: Tutor;
  status: string;
  messageCount: number;
  learningPath?: LearningPath;
  messages: Array<{
    id: string;
    role: string;
    content: string;
    messageType: string;
    codeSnippet?: string;
    timestamp: string;
  }>;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  messageType?: string;
  codeSnippet?: string;
  timestamp: string;
}

export default function AITutorsPage() {
  const router = useRouter();

  // Custom authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name: string } | null>(null);

  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [secret, setSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingTutor, setPendingTutor] = useState<string | null>(null);

  // Tutor System State
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [currentSession, setCurrentSession] = useState<TutorSession | null>(null);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [activeLearningPath, setActiveLearningPath] = useState<LearningPath | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Learning Path Creation
  const [showCreatePathModal, setShowCreatePathModal] = useState(false);
  const [newPathTopic, setNewPathTopic] = useState('');
  const [newPathDifficulty, setNewPathDifficulty] = useState('intermediate');
  const [newPathObjectives, setNewPathObjectives] = useState('');
  const [isCreatingPath, setIsCreatingPath] = useState(false);

  // View State
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarView, setSidebarView] = useState<'tutors' | 'paths' | 'progress'>('tutors');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication on mount
  useEffect(() => {
    const sessionToken = localStorage.getItem('tutorSessionToken');
    const userData = localStorage.getItem('tutorUserData');

    if (sessionToken && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setIsAuthenticated(true);
        loadTutors();
        loadLearningPaths();
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('tutorSessionToken');
        localStorage.removeItem('tutorUserData');
      }
    }
  }, []);

  // Load ElevenLabs script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Helper function for authenticated requests
  const getAuthHeaders = () => {
    const sessionToken = localStorage.getItem('tutorSessionToken');
    return {
      'Content-Type': 'application/json',
      ...(sessionToken && { 'X-Session-Token': sessionToken })
    };
  };

  // API Functions
  const loadTutors = async () => {
    try {
      const response = await fetch('/api/ai-tutors', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setTutors(data.tutors);
      }
    } catch (error) {
      console.error('Error loading tutors:', error);
    }
  };

  const loadLearningPaths = async () => {
    try {
      const response = await fetch('/api/ai-tutors/learning-paths', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setLearningPaths(data.learningPaths);
      }
    } catch (error) {
      console.error('Error loading learning paths:', error);
    }
  };

  const createTutorSession = async (tutor: Tutor) => {
    try {
      const response = await fetch('/api/ai-tutors', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ tutorId: tutor.id })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentSession(data.session);
        setMessages(data.session.messages || []);
        return data.session;
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
    return null;
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentSession || isSendingMessage) return;

    setIsSendingMessage(true);
    const messageContent = newMessage;
    setNewMessage('');

    try {
      const response = await fetch(`/api/ai-tutors/sessions/${currentSession.id}/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          role: 'user',
          content: messageContent
        })
      });

      if (response.ok) {
        const data = await response.json();

        if (data.tutorMessage) {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'user',
            content: messageContent,
            timestamp: new Date().toISOString()
          }, data.tutorMessage]);
        } else {
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'user',
            content: messageContent,
            timestamp: new Date().toISOString()
          }]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const createLearningPath = async () => {
    if (!newPathTopic.trim() || !selectedTutor || isCreatingPath) return;

    setIsCreatingPath(true);

    try {
      const objectives = newPathObjectives.trim()
        ? newPathObjectives.split('\n').filter(obj => obj.trim())
        : undefined;

      const response = await fetch('/api/ai-tutors/learning-paths', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          tutorId: selectedTutor.id,
          topic: newPathTopic,
          difficulty: newPathDifficulty,
          objectives,
          useMistralAI: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        setLearningPaths(prev => [data.learningPath, ...prev]);
        setActiveLearningPath(data.learningPath);
        setShowCreatePathModal(false);
        setNewPathTopic('');
        setNewPathObjectives('');
        setSidebarView('paths');
      }
    } catch (error) {
      console.error('Error creating learning path:', error);
    } finally {
      setIsCreatingPath(false);
    }
  };

  const handleSecretLogin = async () => {
    if (!secret.trim() || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/secret-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret })
      });

      if (response.ok) {
        const data = await response.json();

        // Store session data in localStorage
        localStorage.setItem('tutorSessionToken', data.sessionToken);
        localStorage.setItem('tutorUserData', JSON.stringify(data.user));

        // Update authentication state
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        setShowAuthModal(false);
        setSecret('');

        // Load tutors and learning paths
        loadTutors();
        loadLearningPaths();

        // If there was a pending tutor selection, select it now
        if (pendingTutor) {
          const tutor = tutors.find(t => t.id === pendingTutor);
          if (tutor) {
            setSelectedTutor(tutor);
            const session_data = await createTutorSession(tutor);
            if (session_data) {
              setActiveTab('chat');
            }
          }
          setPendingTutor(null);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid secret');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const selectTutor = async (tutor: Tutor) => {
    if (!isAuthenticated) {
      setPendingTutor(tutor.id);
      setShowAuthModal(true);
      return;
    }

    setSelectedTutor(tutor);
    const session_data = await createTutorSession(tutor);
    if (session_data) {
      setActiveTab('chat');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-sm border border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white mb-2">AI Tutors</CardTitle>
            <p className="text-gray-300">Enter the secret code to access your personalized AI tutoring experience</p>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Lock className="h-4 w-4 mr-2" />
              Enter Access Code
            </Button>
          </CardContent>
        </Card>

        {/* Auth Modal */}
        <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
          <DialogContent className="bg-black/95 border border-purple-500/30 text-white max-w-sm">
            <DialogHeader>
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <DialogTitle className="text-xl font-bold text-white">
                  Enter Access Code
                </DialogTitle>
                <p className="text-gray-400 text-sm mt-2">
                  Testing Mode - Enter the secret code to continue
                </p>
              </div>
            </DialogHeader>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleSecretLogin();
            }} className="space-y-4">
              <div>
                <Input
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter secret code..."
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-400 text-center text-lg tracking-wider"
                  autoFocus
                  maxLength={10}
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-400/30 rounded-lg p-2">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading || !secret.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4 mr-2" />
                    Access AI Tutors
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Hint: The secret is a 5-digit number
                </p>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">NAVADA</h1>
              <span className="text-sm text-purple-400">AI Tutors</span>
            </Link>

            <div className="flex items-center space-x-4">
              {selectedTutor && (
                <div className="hidden md:flex items-center space-x-2 text-sm">
                  <Badge className="bg-purple-900 text-purple-200">
                    {selectedTutor.name}
                  </Badge>
                  {currentSession && (
                    <span className="text-gray-400">
                      {currentSession.messageCount} messages
                    </span>
                  )}
                </div>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreatePathModal(true)}
                disabled={!selectedTutor}
                className="border-purple-500 text-purple-400 hover:bg-purple-600/20"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Path
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gray-900/50 border-r border-gray-800 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex space-x-1">
              <Button
                variant={sidebarView === 'tutors' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSidebarView('tutors')}
                className={`flex-1 ${
                  sidebarView === 'tutors'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'text-gray-300 hover:bg-purple-600/20 hover:text-purple-300'
                }`}
              >
                Tutors
              </Button>
              <Button
                variant={sidebarView === 'paths' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSidebarView('paths')}
                className={`flex-1 ${
                  sidebarView === 'paths'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'text-gray-300 hover:bg-purple-600/20 hover:text-purple-300'
                }`}
              >
                Paths
              </Button>
              <Button
                variant={sidebarView === 'progress' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSidebarView('progress')}
                className={`flex-1 ${
                  sidebarView === 'progress'
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'text-gray-300 hover:bg-purple-600/20 hover:text-purple-300'
                }`}
              >
                Progress
              </Button>
            </div>
          </div>

          {/* Sidebar Content */}
          <ScrollArea className="flex-1">
            {sidebarView === 'tutors' && (
              <div className="p-4 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Available Tutors</h3>
                {tutors.map((tutor) => (
                  <Card
                    key={tutor.id}
                    className={`cursor-pointer transition-all duration-200 border ${
                      selectedTutor?.id === tutor.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 bg-black/20 hover:border-purple-400 hover:bg-purple-400/5'
                    }`}
                    onClick={() => selectTutor(tutor)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tutor.name === 'Marcus' ? 'bg-blue-500' : 'bg-pink-500'
                        }`}>
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{tutor.name}</h4>
                          <p className="text-sm text-gray-400">{tutor.specialization}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {tutor.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {sidebarView === 'paths' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Learning Paths</h3>
                  <Button
                    size="sm"
                    onClick={() => setShowCreatePathModal(true)}
                    disabled={!selectedTutor}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {learningPaths.length === 0 ? (
                  <div className="text-center py-8">
                    <Lightbulb className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">
                      No learning paths yet. Create one to get started!
                    </p>
                  </div>
                ) : (
                  learningPaths.map((path) => (
                    <Card
                      key={path.id}
                      className={`cursor-pointer transition-all duration-200 border ${
                        activeLearningPath?.id === path.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 bg-black/20 hover:border-purple-400'
                      }`}
                      onClick={() => setActiveLearningPath(path)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-white text-sm">{path.title}</h4>
                        <p className="text-xs text-gray-400 mb-2">{path.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {path.difficulty}
                          </Badge>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{path.progress}%</span>
                            <div className="w-16 h-1 bg-gray-700 rounded-full">
                              <div
                                className="h-full bg-purple-500 rounded-full"
                                style={{ width: `${path.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {sidebarView === 'progress' && (
              <div className="p-4 space-y-4">
                <h3 className="text-lg font-semibold text-white">Your Progress</h3>

                {activeLearningPath ? (
                  <div className="space-y-4">
                    <Card className="bg-black/20 border-gray-700">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-white mb-2">{activeLearningPath.title}</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Overall Progress</span>
                              <span className="text-white">{activeLearningPath.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-700 rounded-full">
                              <div
                                className="h-full bg-purple-500 rounded-full transition-all duration-300"
                                style={{ width: `${activeLearningPath.progress}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-white mb-2">Milestones</h5>
                            <div className="space-y-2">
                              {activeLearningPath.milestones.map((milestone) => (
                                <div key={milestone.id} className="flex items-center space-x-2">
                                  {milestone.completed ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Circle className="h-4 w-4 text-gray-500" />
                                  )}
                                  <span className={`text-xs ${
                                    milestone.completed ? 'text-green-400' : 'text-gray-400'
                                  }`}>
                                    {milestone.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-white mb-2">Resources</h5>
                            <div className="space-y-2">
                              {activeLearningPath.resources.map((resource) => (
                                <div key={resource.id} className="flex items-center space-x-2">
                                  {resource.completed ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Circle className="h-4 w-4 text-gray-500" />
                                  )}
                                  <div className="flex items-center space-x-1">
                                    {resource.type === 'video' && <Video className="h-3 w-3 text-gray-500" />}
                                    {resource.type === 'article' && <FileText className="h-3 w-3 text-gray-500" />}
                                    {resource.type === 'code' && <Code className="h-3 w-3 text-gray-500" />}
                                    <span className={`text-xs ${
                                      resource.completed ? 'text-green-400' : 'text-gray-400'
                                    }`}>
                                      {resource.title}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">
                      Select a learning path to view your progress
                    </p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col">
          {!selectedTutor ? (
            // Welcome Screen
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <Brain className="h-16 w-16 text-purple-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4">
                  Welcome to AI Tutors
                </h2>
                <p className="text-gray-400 mb-6">
                  Select a tutor from the sidebar to start your personalized learning journey.
                  Create custom learning paths powered by Mistral AI and work side-by-side with your AI teaching assistant.
                </p>
                <div className="grid grid-cols-1 gap-4 text-left">
                  <div className="flex items-center space-x-3 text-sm text-gray-300">
                    <MessageSquare className="h-5 w-5 text-purple-400" />
                    <span>Interactive chat with specialized AI tutors</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-300">
                    <Target className="h-5 w-5 text-purple-400" />
                    <span>Personalized learning paths with Mistral AI</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-300">
                    <Volume2 className="h-5 w-5 text-purple-400" />
                    <span>Voice conversations with ElevenLabs</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-300">
                    <TrendingUp className="h-5 w-5 text-purple-400" />
                    <span>Progress tracking and achievements</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Active Tutoring Interface
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="border-b border-gray-800 px-6 py-3">
                <TabsList className="bg-gray-800 border-gray-700">
                  <TabsTrigger value="chat" className="data-[state=active]:bg-gray-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="voice" className="data-[state=active]:bg-gray-700">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Voice
                  </TabsTrigger>
                  {activeLearningPath && (
                    <TabsTrigger value="workspace" className="data-[state=active]:bg-gray-700">
                      <Code className="h-4 w-4 mr-2" />
                      Workspace
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0">
                {/* Chat Messages */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                          selectedTutor.name === 'Marcus' ? 'bg-blue-500' : 'bg-pink-500'
                        }`}>
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Meet {selectedTutor.name}
                        </h3>
                        <p className="text-gray-400 mb-4">{selectedTutor.description}</p>
                        <p className="text-sm text-gray-500">
                          Start a conversation by typing a message below
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex space-x-4 ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {message.role === 'assistant' && (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              selectedTutor.name === 'Marcus' ? 'bg-blue-500' : 'bg-pink-500'
                            }`}>
                              <User className="h-4 w-4 text-white" />
                            </div>
                          )}

                          <div className={`max-w-[70%] ${
                            message.role === 'user'
                              ? 'bg-purple-600 text-white rounded-l-lg rounded-tr-lg'
                              : 'bg-gray-800 text-gray-100 rounded-r-lg rounded-tl-lg'
                          } p-4`}>
                            <div className="prose prose-sm prose-invert max-w-none">
                              {message.content}
                            </div>

                            {message.codeSnippet && (
                              <div className="mt-3 p-3 bg-black/50 rounded border border-gray-600">
                                <pre className="text-sm text-green-400 overflow-x-auto">
                                  <code>{message.codeSnippet}</code>
                                </pre>
                              </div>
                            )}

                            <div className="text-xs text-gray-400 mt-2">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                          </div>

                          {message.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      ))
                    )}
                    {isSendingMessage && (
                      <div className="flex space-x-4 justify-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedTutor.name === 'Marcus' ? 'bg-blue-500' : 'bg-pink-500'
                        }`}>
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-gray-800 text-gray-100 rounded-r-lg rounded-tl-lg p-4">
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Chat Input */}
                <div className="border-t border-gray-800 p-6">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex space-x-3">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Ask ${selectedTutor.name} anything...`}
                        className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        disabled={isSendingMessage}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || isSendingMessage}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isSendingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="voice" className="flex-1 flex items-center justify-center m-0 p-6">
                <div className="text-center max-w-md">
                  <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
                    selectedTutor.name === 'Marcus' ? 'bg-blue-500' : 'bg-pink-500'
                  }`}>
                    <Volume2 className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Voice Chat with {selectedTutor.name}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Start a natural voice conversation with your AI tutor powered by ElevenLabs
                  </p>

                  {selectedTutor.elevenLabsAgentId && (
                    <div className="bg-black/20 rounded-lg p-6 border border-gray-700">
                      <div className="flex items-center justify-center mb-4">
                        <div className="flex items-center space-x-2 text-sm text-green-400">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span>Voice Chat Active</span>
                        </div>
                      </div>
                      <elevenlabs-convai agent-id={selectedTutor.elevenLabsAgentId}></elevenlabs-convai>
                    </div>
                  )}
                </div>
              </TabsContent>

              {activeLearningPath && (
                <TabsContent value="workspace" className="flex-1 m-0 p-6">
                  <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Learning Path Overview */}
                      <Card className="bg-black/20 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center space-x-2">
                            <Target className="h-5 w-5" />
                            <span>{activeLearningPath.title}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-gray-300 text-sm">{activeLearningPath.description}</p>

                          <div>
                            <h4 className="text-sm font-medium text-white mb-2">Learning Objectives</h4>
                            <div className="space-y-1">
                              {activeLearningPath.objectives.map((objective, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <CheckCircle className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-gray-300">{objective}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-white mb-2">Topics Covered</h4>
                            <div className="flex flex-wrap gap-2">
                              {activeLearningPath.topics.map((topic, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Interactive Workspace */}
                      <Card className="bg-black/20 border-gray-700">
                        <CardHeader>
                          <CardTitle className="text-white flex items-center space-x-2">
                            <Code className="h-5 w-5" />
                            <span>Interactive Workspace</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="text-center py-8">
                              <Settings className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                              <p className="text-gray-400 text-sm">
                                Interactive coding environment coming soon!
                              </p>
                              <p className="text-gray-500 text-xs mt-2">
                                This will include code execution, quizzes, and hands-on exercises
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          )}
        </div>
      </div>

      {/* Create Learning Path Modal */}
      <Dialog open={showCreatePathModal} onOpenChange={setShowCreatePathModal}>
        <DialogContent className="bg-black/95 border border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-purple-400" />
              <span>Create Learning Path</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a personalized learning path with {selectedTutor?.name} using Mistral AI
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Topic</label>
              <Input
                value={newPathTopic}
                onChange={(e) => setNewPathTopic(e.target.value)}
                placeholder="e.g., React Hooks, Python Basics, Linear Algebra"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Difficulty</label>
              <Select value={newPathDifficulty} onValueChange={setNewPathDifficulty}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Learning Objectives (optional)
              </label>
              <Textarea
                value={newPathObjectives}
                onChange={(e) => setNewPathObjectives(e.target.value)}
                placeholder="Enter one objective per line..."
                className="bg-gray-800 border-gray-700 text-white"
                rows={3}
              />
            </div>

            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Brain className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-purple-300 font-medium">Powered by Mistral AI</p>
                  <p className="text-xs text-purple-400 mt-1">
                    We'll generate a comprehensive learning path with milestones, resources, and structured content
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreatePathModal(false)}
              className="border-gray-600 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={createLearningPath}
              disabled={!newPathTopic.trim() || isCreatingPath}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isCreatingPath ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Path
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="bg-black/95 border border-purple-500/30 text-white max-w-sm">
          <DialogHeader>
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600 flex items-center justify-center">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <DialogTitle className="text-xl font-bold text-white">
                Enter Access Code
              </DialogTitle>
              <p className="text-gray-400 text-sm mt-2">
                Testing Mode - Enter the secret code to continue
              </p>
            </div>
          </DialogHeader>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleSecretLogin();
          }} className="space-y-4">
            <div>
              <Input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter secret code..."
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-400 text-center text-lg tracking-wider"
                autoFocus
                maxLength={10}
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 border border-red-400/30 rounded-lg p-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading || !secret.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  Access AI Tutors
                </>
              )}
            </Button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Hint: The secret is a 5-digit number
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
