'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectStatus } from '@/lib/paraSystem';

interface KnowledgeNode {
  id: string;
  name: string;
  type: 'project' | 'area' | 'resource' | 'person' | 'note';
  x: number;
  y: number;
  connections: string[];
  description?: string;
  lastAccessed?: string;
}

interface KnowledgeConnection {
  from: string;
  to: string;
  strength: number;
  type: 'related' | 'dependency' | 'reference';
}

interface KnowledgeGraphProps {
  projects?: ProjectStatus[];
  className?: string;
}

export default function KnowledgeGraph({ projects = [], className = '' }: KnowledgeGraphProps) {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [connections, setConnections] = useState<KnowledgeConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [viewMode, setViewMode] = useState<'graph' | 'list' | 'timeline'>('graph');

  useEffect(() => {
    // Convert projects to knowledge nodes
    const projectNodes: KnowledgeNode[] = projects.map((project, index) => ({
      id: project.id,
      name: project.name,
      type: 'project',
      x: Math.cos((index * 2 * Math.PI) / projects.length) * 150 + 250,
      y: Math.sin((index * 2 * Math.PI) / projects.length) * 150 + 200,
      connections: [],
      description: project.description,
      lastAccessed: project.lastUpdated,
    }));

    // Add some mock knowledge nodes
    const knowledgeNodes: KnowledgeNode[] = [
      {
        id: 'ai-agents',
        name: 'AI Agents',
        type: 'resource',
        x: 400,
        y: 150,
        connections: ['lifeos-dashboard', 'portfolio-site'],
        description: 'Research and development in AI agent systems',
        lastAccessed: '2026-04-07'
      },
      {
        id: 'creative-tech',
        name: 'Creative Technology',
        type: 'area',
        x: 100,
        y: 300,
        connections: ['wizard-staff', 'portfolio-site'],
        description: 'Intersection of creativity and technology',
        lastAccessed: '2026-04-06'
      },
      {
        id: 'festival-prep',
        name: 'Festival Preparation',
        type: 'note',
        x: 200,
        y: 100,
        connections: ['wizard-staff'],
        description: 'Notes and planning for upcoming festivals',
        lastAccessed: '2026-04-05'
      },
    ];

    setNodes([...projectNodes, ...knowledgeNodes]);

    // Generate connections based on related topics
    const autoConnections: KnowledgeConnection[] = [
      { from: 'lifeos-dashboard', to: 'ai-agents', strength: 0.8, type: 'related' },
      { from: 'portfolio-site', to: 'creative-tech', strength: 0.9, type: 'related' },
      { from: 'wizard-staff', to: 'festival-prep', strength: 0.7, type: 'dependency' },
      { from: 'wizard-staff', to: 'creative-tech', strength: 0.6, type: 'related' },
      { from: 'ai-agents', to: 'creative-tech', strength: 0.4, type: 'reference' },
    ];

    setConnections(autoConnections);
  }, [projects]);

  const getNodeColor = (node: KnowledgeNode): string => {
    switch (node.type) {
      case 'project': return '#00ffff';
      case 'area': return '#ff6b35';
      case 'resource': return '#ffaa00';
      case 'person': return '#ff6b35';
      case 'note': return '#00ffff';
      default: return '#ffffff';
    }
  };

  const GraphView = () => (
    <div className="relative w-full h-96 bg-command-panel/10 border border-command-border/20 rounded overflow-hidden">
      <svg className="w-full h-full">
        {/* Render connections */}
        {connections.map((conn, index) => {
          const fromNode = nodes.find(n => n.id === conn.from);
          const toNode = nodes.find(n => n.id === conn.to);
          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={`${conn.from}-${conn.to}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={conn.type === 'dependency' ? '#ff6b35' : '#00ffff'}
              strokeWidth={conn.strength * 2}
              strokeOpacity={0.4}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          );
        })}

        {/* Render nodes */}
        {nodes.map((node, index) => (
          <motion.g
            key={node.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.type === 'project' ? 12 : 8}
              fill={getNodeColor(node)}
              stroke={selectedNode?.id === node.id ? '#ffffff' : 'transparent'}
              strokeWidth={2}
              className="cursor-pointer"
              whileHover={{ scale: 1.2 }}
              onClick={() => setSelectedNode(node)}
            />
            <text
              x={node.x}
              y={node.y + 25}
              textAnchor="middle"
              className="fill-command-text text-xs font-mono"
              style={{ pointerEvents: 'none' }}
            >
              {node.name.split(' ').slice(0, 2).join(' ')}
            </text>
          </motion.g>
        ))}
      </svg>

      {/* Node details overlay */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-4 right-4 bg-command-surface/90 border border-command-border/30 rounded-lg p-4 max-w-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-mono text-sm text-command-text font-bold">
                {selectedNode.name}
              </h4>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-command-muted hover:text-command-text"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono text-command-accent uppercase">
                {selectedNode.type}
              </div>
              <div className="text-xs text-command-muted">
                {selectedNode.description}
              </div>
              <div className="text-xs text-command-primary">
                Last: {selectedNode.lastAccessed}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const ListView = () => (
    <div className="space-y-2">
      {nodes.map((node, index) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-command-panel/20 border border-command-border/20 rounded p-3 hover:border-command-primary/40 transition-all cursor-pointer"
          onClick={() => setSelectedNode(node)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getNodeColor(node) }}
              />
              <div>
                <div className="font-mono text-sm text-command-text">
                  {node.name}
                </div>
                <div className="font-mono text-xs text-command-muted">
                  {node.type.toUpperCase()} • {node.connections.length} connections
                </div>
              </div>
            </div>
            <div className="font-mono text-xs text-command-primary">
              {node.lastAccessed?.split('-').slice(1).join('.')}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const ViewToggle = () => (
    <div className="flex bg-command-panel/30 border border-command-border/30 rounded-lg p-1">
      {(['graph', 'list', 'timeline'] as const).map((mode) => (
        <motion.button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`px-3 py-1 font-mono text-xs tracking-wider uppercase transition-all ${
            viewMode === mode
              ? 'bg-command-primary text-command-background'
              : 'text-command-muted hover:text-command-text'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {mode}
        </motion.button>
      ))}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-command-surface/80 border-2 border-command-accent/20 rounded-lg p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-command-accent rounded-full animate-pulse"></div>
          <h2 className="font-mono text-lg text-command-text tracking-wider">
            KNOWLEDGE.GRAPH
          </h2>
        </div>
        <ViewToggle />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'graph' && <GraphView />}
          {viewMode === 'list' && <ListView />}
          {viewMode === 'timeline' && (
            <div className="text-center py-8 text-command-muted font-mono text-sm">
              TIMELINE.VIEW.COMING.SOON
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}