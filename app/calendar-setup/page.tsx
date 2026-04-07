'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function CalendarSetupPage() {
  const searchParams = useSearchParams();
  const [authUrl, setAuthUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  const success = searchParams.get('success');
  const error = searchParams.get('error');
  const tokensParam = searchParams.get('tokens');

  useEffect(() => {
    if (!success && !error) {
      // Get auth URL from backend
      fetch('/api/auth/google/url')
        .then(res => res.json())
        .then(data => {
          if (data.authUrl) {
            setAuthUrl(data.authUrl);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to get auth URL:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [success, error]);

  const tokens = tokensParam ? JSON.parse(decodeURIComponent(tokensParam)) : null;

  return (
    <div className="min-h-screen bg-command-background text-command-text flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-command-surface/80 border-2 border-command-primary/20 rounded-lg p-8 max-w-2xl w-full"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 bg-command-primary rounded-full animate-pulse"></div>
          <h1 className="font-mono text-2xl text-command-text tracking-wider">
            GOOGLE.CALENDAR.SETUP
          </h1>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="font-mono text-sm text-command-muted">INITIALIZING.OAUTH.FLOW...</div>
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-command-secondary/10 border border-command-secondary/30 rounded p-4 mb-6"
          >
            <div className="font-mono text-sm text-command-secondary mb-2">
              ERROR: {error.replace(/_/g, ' ').toUpperCase()}
            </div>
            <div className="font-mono text-xs text-command-muted">
              Check console for details or try again
            </div>
          </motion.div>
        )}

        {success && tokens && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-command-primary/10 border border-command-primary/30 rounded p-4">
              <div className="font-mono text-sm text-command-primary mb-2">
                ✓ OAUTH.SUCCESS - Calendar access granted!
              </div>
            </div>

            <div className="space-y-4">
              <div className="font-mono text-sm text-command-text">
                Add these to your .env.local file:
              </div>
              
              <div className="bg-command-background/50 border border-command-border/30 rounded p-4 font-mono text-xs">
                <div className="text-command-accent mb-2"># Add to .env.local</div>
                <div className="space-y-1 text-command-text">
                  <div>GOOGLE_ACCESS_TOKEN={tokens.access_token}</div>
                  <div>GOOGLE_REFRESH_TOKEN={tokens.refresh_token}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const envText = `GOOGLE_ACCESS_TOKEN=${tokens.access_token}\nGOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`;
                    navigator.clipboard.writeText(envText);
                  }}
                  className="px-4 py-2 bg-command-primary/20 border border-command-primary/30 rounded font-mono text-xs text-command-primary hover:bg-command-primary/30 transition-all"
                >
                  COPY.TO.CLIPBOARD
                </motion.button>
                
                <motion.a
                  href="/"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-command-accent/20 border border-command-accent/30 rounded font-mono text-xs text-command-accent hover:bg-command-accent/30 transition-all"
                >
                  RETURN.TO.DASHBOARD
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && !success && !error && authUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="font-mono text-sm text-command-text">
                Connect your Google Calendar to enable real calendar data:
              </div>
              
              <div className="bg-command-panel/20 border border-command-border/20 rounded p-4">
                <div className="space-y-2 font-mono text-xs text-command-muted">
                  <div>• ✓ Read your calendar events</div>
                  <div>• ✓ View upcoming appointments</div>
                  <div>• ✓ Integrate with habit tracking</div>
                  <div>• ✓ Secure OAuth 2.0 authentication</div>
                </div>
              </div>

              <motion.a
                href={authUrl}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="block w-full text-center px-6 py-3 bg-command-primary/20 border-2 border-command-primary/30 rounded-lg font-mono text-sm text-command-primary hover:bg-command-primary/30 hover:border-command-primary/50 transition-all"
              >
                🔗 CONNECT.GOOGLE.CALENDAR
              </motion.a>
            </div>

            <div className="border-t border-command-border/20 pt-4">
              <div className="font-mono text-xs text-command-muted">
                <div className="mb-2">ALTERNATIVE: Manual setup with service account</div>
                <div>• More complex but fully automated</div>
                <div>• Requires sharing calendar with service account</div>
                <div>• See .env.example for service account setup</div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}