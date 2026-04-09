'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Calendar, TrendingUp, Users, Lightbulb, Target } from 'lucide-react';

interface DailyMemory {
  date: string;
  content: string;
  insights: string[];
  actionItems: string[];
  people: string[];
  projects: string[];
}

interface ConversationInsight {
  type: 'action' | 'idea' | 'decision' | 'person' | 'project';
  content: string;
  date: string;
  context: string;
}

interface MemoryStats {
  totalDays: number;
  totalInsights: number;
  recentActivity: number;
  topTopics: string[];
}

export interface MemoryData {
  recentMemories: DailyMemory[];
  insights: ConversationInsight[];
  stats: MemoryStats;
  longTermMemory?: string;
}

interface MemoryViewProps {
  data?: MemoryData;
}

export default function MemoryView({ data }: MemoryViewProps) {
  const [activeTab, setActiveTab] = useState<'recent' | 'insights' | 'search' | 'patterns'>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-zinc-900 rounded-lg border border-cyan-400/20 p-6 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-cyan-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Loading Conversation Memory...</h3>
          <p className="text-zinc-400">Accessing our shared knowledge</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'action': return <Target className="h-4 w-4" />;
      case 'person': return <Users className="h-4 w-4" />;
      case 'idea': return <Lightbulb className="h-4 w-4" />;
      case 'project': return <TrendingUp className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'action': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'person': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'idea': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'project': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Memory System Header */}
      <div className="bg-zinc-900 rounded-lg border border-cyan-400/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-8 w-8 text-cyan-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Conversation Memory</h2>
              <p className="text-zinc-400">Our shared knowledge and insights</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none w-64"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Memory Days</span>
              <Calendar className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{data.stats.totalDays}</div>
          </div>
          
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Total Insights</span>
              <Lightbulb className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{data.stats.totalInsights}</div>
          </div>
          
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Recent Activity</span>
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{data.stats.recentActivity}</div>
          </div>
          
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Top Topics</span>
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{data.stats.topTopics.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'recent', label: 'Recent Memories', icon: Calendar },
            { id: 'insights', label: 'Key Insights', icon: Lightbulb },
            { id: 'search', label: 'Search History', icon: Search },
            { id: 'patterns', label: 'Patterns', icon: TrendingUp },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-zinc-400 hover:text-white hover:border-zinc-300'
              }`}
            >
              <Icon className={`mr-2 h-5 w-5 ${
                activeTab === id ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-white'
              }`} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'recent' && (
          <div className="space-y-6">
            {data.recentMemories.length > 0 ? (
              data.recentMemories.map((memory) => (
                <div
                  key={memory.date}
                  className="bg-zinc-900 rounded-lg border border-zinc-700 p-6 hover:border-cyan-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">
                      {formatDate(memory.date)}
                    </h3>
                    <div className="flex space-x-4 text-sm">
                      {memory.actionItems.length > 0 && (
                        <span className="text-orange-400">{memory.actionItems.length} actions</span>
                      )}
                      {memory.projects.length > 0 && (
                        <span className="text-green-400">{memory.projects.length} projects</span>
                      )}
                      {memory.people.length > 0 && (
                        <span className="text-purple-400">{memory.people.length} people</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {memory.insights.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-yellow-400 mb-2">Key Insights</h4>
                        <ul className="text-sm text-zinc-300 space-y-1">
                          {memory.insights.slice(0, 3).map((insight, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-yellow-400 mr-2">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {memory.actionItems.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-orange-400 mb-2">Action Items</h4>
                        <ul className="text-sm text-zinc-300 space-y-1">
                          {memory.actionItems.slice(0, 3).map((action, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-orange-400 mr-2">•</span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {memory.projects.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-green-400 mb-2">Projects</h4>
                        <ul className="text-sm text-zinc-300 space-y-1">
                          {memory.projects.slice(0, 3).map((project, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-green-400 mr-2">•</span>
                              {project}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-700">
                    <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                      View Full Memory →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
                <p className="text-zinc-400">No recent memories found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            {data.insights.length > 0 ? (
              data.insights.map((insight, index) => (
                <div
                  key={index}
                  className="bg-zinc-900 rounded-lg border border-zinc-700 p-4 hover:border-cyan-400/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs border ${getInsightColor(insight.type)}`}>
                        {getInsightIcon(insight.type)}
                        <span className="ml-1 capitalize">{insight.type}</span>
                      </span>
                      <span className="text-sm text-zinc-400">{formatDate(insight.date)}</span>
                    </div>
                  </div>
                  
                  <p className="text-white text-sm mb-3">{insight.content}</p>
                  
                  {insight.context && (
                    <div className="bg-zinc-800 rounded p-3">
                      <p className="text-xs text-zinc-400 leading-relaxed">{insight.context}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Lightbulb className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
                <p className="text-zinc-400">No insights extracted yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Search Conversations</h3>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Enter search terms..."
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <button className="bg-cyan-400 text-black px-6 py-2 rounded-md font-semibold hover:bg-cyan-300 transition-colors">
                Search Memory
              </button>
            </div>

            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
              <p className="text-zinc-400">Enter a search term to explore our conversation history</p>
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Top Topics</h3>
              <div className="space-y-3">
                {data.stats.topTopics.slice(0, 10).map((topic, index) => (
                  <div key={topic} className="flex items-center justify-between">
                    <span className="text-zinc-300">{topic}</span>
                    <span className="text-cyan-400 text-sm">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg border border-zinc-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Activity Trends</h3>
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
                <p className="text-zinc-400">Activity visualization coming soon</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}