'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon,
  Cog6ToothIcon,
  PaintBrushIcon,
  BellIcon,
  ClockIcon,
  ShieldCheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface DashboardSettingsProps {
  onClose: () => void;
}

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: 'appearance',
    title: 'Appearance',
    icon: PaintBrushIcon,
    description: 'Customize dashboard theme and layout'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: BellIcon,
    description: 'Configure alerts and reminders'
  },
  {
    id: 'sync',
    title: 'Sync & Integration',
    icon: ArrowPathIcon,
    description: 'Connect external services and data sources'
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: ShieldCheckIcon,
    description: 'Manage data privacy and security settings'
  },
  {
    id: 'time',
    title: 'Time & Location',
    icon: ClockIcon,
    description: 'Set timezone and location preferences'
  }
];

export default function DashboardSettings({ onClose }: DashboardSettingsProps) {
  const [activeSection, setActiveSection] = useState<string>('appearance');
  const [settings, setSettings] = useState({
    theme: 'dark',
    compactMode: false,
    animations: true,
    sidebarCollapsed: false,
    notifications: {
      taskReminders: true,
      deadlineAlerts: true,
      emailDigest: false,
      soundEnabled: true
    },
    sync: {
      googleCalendar: true,
      notionIntegration: false,
      autoSync: true,
      syncInterval: 15
    },
    privacy: {
      analyticsEnabled: false,
      dataSharing: false,
      localStorageOnly: true
    },
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '24h'
  });

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.');
      const newSettings = { ...prev };
      let current = newSettings as any;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div>
        <label className="block text-sm font-mono text-command-text mb-3">THEME</label>
        <div className="grid grid-cols-3 gap-3">
          {['dark', 'light', 'auto'].map(theme => (
            <button
              key={theme}
              onClick={() => updateSetting('theme', theme)}
              className={`p-3 rounded-lg border transition-all ${
                settings.theme === theme
                  ? 'border-command-primary/50 bg-command-primary/10'
                  : 'border-command-border/30 hover:border-command-border/50'
              }`}
            >
              <div className={`w-full h-8 rounded mb-2 ${
                theme === 'dark' ? 'bg-gray-900' : theme === 'light' ? 'bg-gray-100' : 'bg-gradient-to-r from-gray-900 to-gray-100'
              }`}></div>
              <div className="text-xs font-mono text-command-text">{theme.toUpperCase()}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Layout Options */}
      <div>
        <label className="block text-sm font-mono text-command-text mb-3">LAYOUT</label>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-command-muted">Compact Mode</span>
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => updateSetting('compactMode', e.target.checked)}
              className="w-4 h-4 text-command-primary bg-command-background border-command-border rounded focus:ring-command-primary"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm text-command-muted">Animations</span>
            <input
              type="checkbox"
              checked={settings.animations}
              onChange={(e) => updateSetting('animations', e.target.checked)}
              className="w-4 h-4 text-command-primary bg-command-background border-command-border rounded focus:ring-command-primary"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm text-command-muted">Sidebar Collapsed by Default</span>
            <input
              type="checkbox"
              checked={settings.sidebarCollapsed}
              onChange={(e) => updateSetting('sidebarCollapsed', e.target.checked)}
              className="w-4 h-4 text-command-primary bg-command-background border-command-border rounded focus:ring-command-primary"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-mono text-command-text mb-3">TASK NOTIFICATIONS</label>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-command-muted">Task Reminders</span>
            <input
              type="checkbox"
              checked={settings.notifications.taskReminders}
              onChange={(e) => updateSetting('notifications.taskReminders', e.target.checked)}
              className="w-4 h-4 text-command-primary bg-command-background border-command-border rounded focus:ring-command-primary"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm text-command-muted">Deadline Alerts</span>
            <input
              type="checkbox"
              checked={settings.notifications.deadlineAlerts}
              onChange={(e) => updateSetting('notifications.deadlineAlerts', e.target.checked)}
              className="w-4 h-4 text-command-primary bg-command-background border-command-border rounded focus:ring-command-primary"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm text-command-muted">Daily Email Digest</span>
            <input
              type="checkbox"
              checked={settings.notifications.emailDigest}
              onChange={(e) => updateSetting('notifications.emailDigest', e.target.checked)}
              className="w-4 h-4 text-command-primary bg-command-background border-command-border rounded focus:ring-command-primary"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <span className="text-sm text-command-muted">Sound Notifications</span>
            <input
              type="checkbox"
              checked={settings.notifications.soundEnabled}
              onChange={(e) => updateSetting('notifications.soundEnabled', e.target.checked)}
              className="w-4 h-4 text-command-primary bg-command-background border-command-border rounded focus:ring-command-primary"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderSyncSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-mono text-command-text mb-3">INTEGRATIONS</label>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm text-command-text">Google Calendar</div>
              <div className="text-xs text-command-muted">Sync events and reminders</div>
            </div>
            <input
              type="checkbox"
              checked={settings.sync.googleCalendar}
              onChange={(e) => updateSetting('sync.googleCalendar', e.target.checked)}
              className="w-4 h-4 text-command-primary bg-command-background border-command-border rounded focus:ring-command-primary"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm text-command-text">Notion Integration</div>
              <div className="text-xs text-command-muted">Connect to Notion workspace</div>
            </div>
            <input
              type="checkbox"
              checked={settings.sync.notionIntegration}
              onChange={(e) => updateSetting('sync.notionIntegration', e.target.checked)}
              className="w-4 h-4 text-command-primary bg-command-background border-command-border rounded focus:ring-command-primary"
            />
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-mono text-command-text mb-3">SYNC PREFERENCES</label>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm text-command-muted">Auto-sync</span>
            <input
              type="checkbox"
              checked={settings.sync.autoSync}
              onChange={(e) => updateSetting('sync.autoSync', e.target.checked)}
              className="w-4 h-4 text-command-primary bg-command-background border-command-border rounded focus:ring-command-primary"
            />
          </label>
          
          <div>
            <label className="block text-sm text-command-muted mb-2">Sync Interval (minutes)</label>
            <select
              value={settings.sync.syncInterval}
              onChange={(e) => updateSetting('sync.syncInterval', parseInt(e.target.value))}
              className="w-full bg-command-background border border-command-border/30 rounded-lg px-3 py-2 text-command-text focus:outline-none focus:ring-2 focus:ring-command-primary/50"
            >
              <option value={5}>5 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-mono text-command-text mb-3">DATA & PRIVACY</label>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm text-command-text">Analytics Enabled</div>
              <div className="text-xs text-command-muted">Help improve LifeOS with usage data</div>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy.analyticsEnabled}
              onChange={(e) => updateSetting('privacy.analyticsEnabled', e.target.checked)}
              className="w-4 h-4 text-command-primary bg-command-background border-command-border rounded focus:ring-command-primary"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm text-command-text">Data Sharing</div>
              <div className="text-xs text-command-muted">Share anonymized data for research</div>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy.dataSharing}
              onChange={(e) => updateSetting('privacy.dataSharing', e.target.checked)}
              className="w-4 h-4 text-command-primary bg-command-background border-command-border rounded focus:ring-command-primary"
            />
          </label>
          
          <label className="flex items-center justify-between">
            <div>
              <div className="text-sm text-command-text">Local Storage Only</div>
              <div className="text-xs text-command-muted">Keep all data on your device</div>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy.localStorageOnly}
              onChange={(e) => updateSetting('privacy.localStorageOnly', e.target.checked)}
              className="w-4 h-4 text-command-primary bg-command-background border-command-border rounded focus:ring-command-primary"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderTimeSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-mono text-command-text mb-3">TIMEZONE</label>
        <select
          value={settings.timezone}
          onChange={(e) => updateSetting('timezone', e.target.value)}
          className="w-full bg-command-background border border-command-border/30 rounded-lg px-3 py-2 text-command-text focus:outline-none focus:ring-2 focus:ring-command-primary/50"
        >
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Chicago">Central Time</option>
          <option value="America/Denver">Mountain Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
          <option value="UTC">UTC</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-mono text-command-text mb-3">DATE FORMAT</label>
        <select
          value={settings.dateFormat}
          onChange={(e) => updateSetting('dateFormat', e.target.value)}
          className="w-full bg-command-background border border-command-border/30 rounded-lg px-3 py-2 text-command-text focus:outline-none focus:ring-2 focus:ring-command-primary/50"
        >
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-mono text-command-text mb-3">TIME FORMAT</label>
        <select
          value={settings.timeFormat}
          onChange={(e) => updateSetting('timeFormat', e.target.value)}
          className="w-full bg-command-background border border-command-border/30 rounded-lg px-3 py-2 text-command-text focus:outline-none focus:ring-2 focus:ring-command-primary/50"
        >
          <option value="12h">12-hour (AM/PM)</option>
          <option value="24h">24-hour</option>
        </select>
      </div>
    </div>
  );

  const renderSettings = () => {
    switch (activeSection) {
      case 'appearance':
        return renderAppearanceSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'sync':
        return renderSyncSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'time':
        return renderTimeSettings();
      default:
        return renderAppearanceSettings();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-command-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-command-surface border border-command-border/30 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-command-border/30">
          <div className="flex items-center gap-3">
            <Cog6ToothIcon className="w-6 h-6 text-command-primary" />
            <div>
              <h2 className="font-mono text-xl font-bold text-command-text tracking-wider">
                DASHBOARD.SETTINGS
              </h2>
              <p className="text-sm text-command-muted">Customize your LifeOS experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-command-muted hover:text-command-text transition-colors rounded-lg hover:bg-command-panel/20"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 bg-command-panel/20 border-r border-command-border/30 p-4">
            <div className="space-y-2">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                      activeSection === section.id
                        ? 'bg-command-primary/10 text-command-primary border border-command-primary/30'
                        : 'text-command-muted hover:text-command-text hover:bg-command-panel/20'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="font-mono text-sm">{section.title}</div>
                      <div className="text-xs opacity-70">{section.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderSettings()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-command-border/30">
          <div className="text-xs text-command-muted font-mono">
            LIFEOS.SETTINGS • Last saved: {new Date().toLocaleTimeString()}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-command-muted hover:text-command-text transition-colors font-mono text-sm"
            >
              CANCEL
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-command-primary/20 border border-command-primary/30 rounded-lg text-command-primary hover:bg-command-primary/30 transition-all font-mono text-sm"
            >
              SAVE.SETTINGS
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}