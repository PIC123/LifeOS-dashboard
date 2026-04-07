'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, FileText, Search, Link, Calendar, Hash } from 'lucide-react';

interface AtomicNote {
  id: string;
  title: string;
  content: string;
  created: Date;
  tags: string[];
  connections: string[];
}

interface KnowledgeMap {
  id: string;
  title: string;
  content: string;
  connectedNotes: string[];
  lastUpdated: Date;
}

interface KnowledgeData {
  recentNotes: AtomicNote[];
  maps: KnowledgeMap[];
  inbox: Array<{title: string, content: string, created: Date}>;
  stats: {
    totalNotes: number;
    totalMaps: number;
    inboxCount: number;
  };
}

interface KnowledgeViewProps {
  data?: KnowledgeData;
}

export default function KnowledgeView({ data }: KnowledgeViewProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'maps' | 'inbox'>('notes');
  const [searchQuery, setSearchQuery] = useState('');

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-zinc-900 rounded-lg border border-cyan-400/20 p-6 text-center">
          <Brain className="mx-auto h-12 w-12 text-cyan-400 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Loading Zettelkasten...</h3>
          <p className="text-zinc-400">Connecting to your knowledge system</p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  };

  return (
    <div className="space-y-6">
      {/* Knowledge System Header */}
      <div className="bg-zinc-900 rounded-lg border border-cyan-400/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-cyan-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Zettelkasten System</h2>
              <p className="text-zinc-400">Your connected knowledge network</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search knowledge..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none w-64"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Atomic Notes</span>
              <FileText className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{data.stats.totalNotes}</div>
          </div>
          
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Knowledge Maps</span>
              <Link className="h-5 w-5 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{data.stats.totalMaps}</div>
          </div>
          
          <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Inbox Items</span>
              <Calendar className="h-5 w-5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-2">{data.stats.inboxCount}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'notes', label: 'Recent Notes', icon: FileText },
            { id: 'maps', label: 'Knowledge Maps', icon: Link },
            { id: 'inbox', label: 'Inbox', icon: Calendar },
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
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.recentNotes.length > 0 ? (
              data.recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-zinc-900 rounded-lg border border-zinc-700 p-6 hover:border-cyan-400/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-white text-lg">{note.title}</h3>
                    <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
                      {note.id}
                    </span>
                  </div>
                  
                  <p className="text-zinc-300 text-sm mb-4 leading-relaxed">
                    {truncateContent(note.content)}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
                        >
                          <Hash className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="text-xs text-zinc-400">+{note.tags.length - 3}</span>
                      )}
                    </div>
                    
                    {note.connections.length > 0 && (
                      <div className="flex items-center text-xs text-zinc-400">
                        <Link className="h-4 w-4 mr-1" />
                        {note.connections.length}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-zinc-700">
                    <span className="text-xs text-zinc-400">
                      Created: {formatDate(note.created)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
                <p className="text-zinc-400">No atomic notes found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'maps' && (
          <div className="grid grid-cols-1 gap-6">
            {data.maps.length > 0 ? (
              data.maps.map((map) => (
                <div
                  key={map.id}
                  className="bg-zinc-900 rounded-lg border border-zinc-700 p-6 hover:border-orange-400/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-white text-xl">{map.title}</h3>
                    <div className="flex items-center text-sm text-zinc-400">
                      <Link className="h-4 w-4 mr-2" />
                      {map.connectedNotes.length} connections
                    </div>
                  </div>
                  
                  <p className="text-zinc-300 text-sm mb-4 leading-relaxed">
                    {truncateContent(map.content, 200)}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-zinc-700 flex justify-between items-center">
                    <span className="text-xs text-zinc-400">
                      Updated: {formatDate(map.lastUpdated)}
                    </span>
                    <button className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                      View Map →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Link className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
                <p className="text-zinc-400">No knowledge maps found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'inbox' && (
          <div className="space-y-4">
            {data.inbox.length > 0 ? (
              data.inbox.map((item, index) => (
                <div
                  key={index}
                  className="bg-zinc-900 rounded-lg border border-zinc-700 p-4 hover:border-amber-400/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <span className="text-xs text-zinc-400">
                      {formatDate(item.created)}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-sm">
                    {truncateContent(item.content)}
                  </p>
                  <div className="mt-3 flex justify-end">
                    <button className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
                      Process →
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
                <p className="text-zinc-400">Inbox is empty</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}