'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import { ActionVoice, NavClose, ActionPlay, ActionPause, ActionComplete } from '@/components/ui/Icons';
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/utils';

interface VoiceMemo {
  id: string;
  transcript: string;
  duration: number;
  timestamp: number;
  confidence?: number;
}

interface VoiceMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
  };
}

interface SpeechRecognitionError {
  error: string;
}

export default function VoiceMemoModal({ isOpen, onClose }: VoiceMemoModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      return !!SpeechRecognition;
    }
    return false;
  });
  const [startTime, setStartTime] = useState<number>(0);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && isSupported) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsRecording(true);
          setStartTime(Date.now());
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptPart = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcriptPart + ' ';
            } else {
              interimTranscript += transcriptPart;
            }
          }

          setTranscript(prev => prev + finalTranscript + interimTranscript);
        };

        recognition.onerror = (event: SpeechRecognitionError) => {
          console.error('Speech recognition error:', event.error);
          toast.error('Voice recognition error. Please try again.');
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  const startRecording = () => {
    if (!recognitionRef.current) return;
    
    setTranscript('');
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Could not start recording. Please try again.');
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const saveVoiceMemo = () => {
    if (!transcript.trim()) {
      toast.error('No transcript to save');
      return;
    }

    const duration = startTime ? Date.now() - startTime : 0;
    const memo: VoiceMemo = {
      id: crypto.randomUUID(),
      transcript: transcript.trim(),
      duration,
      timestamp: Date.now()
    };

    const existingMemos = loadFromLocalStorage<VoiceMemo[]>('lifeos-voice-memos', []);
    const updatedMemos = [memo, ...existingMemos];
    saveToLocalStorage('lifeos-voice-memos', updatedMemos);

    toast.success('Voice memo saved! 🎙️', { duration: 2000 });
    setTranscript('');
    onClose();
  };

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
    setTranscript('');
    onClose();
  };

  if (!isSupported) {
    return (
      <AnimatePresence>
        {isOpen && (
          <Dialog as={motion.div} open={isOpen} onClose={handleClose} className="relative z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel
                as={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-md bg-command-surface border border-command-border rounded-xl p-6 text-center"
              >
                <ActionVoice className="mx-auto mb-4 text-command-muted" size="xl" />
                <h3 className="text-lg font-semibold text-command-text mb-2">
                  Voice Recognition Not Supported
                </h3>
                <p className="text-command-muted mb-6">
                  Your browser doesn&apos;t support voice recognition. Please try using Chrome or Edge.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="px-6 py-3 bg-command-primary text-white rounded-lg"
                >
                  Got it
                </motion.button>
              </Dialog.Panel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog as={motion.div} open={isOpen} onClose={handleClose} className="relative z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              // @ts-expect-error - Framer Motion transition typing issue
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="w-full max-w-md bg-command-surface border border-command-border rounded-xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ scale: isRecording ? [1, 1.2, 1] : 1 }}
                    transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
                  >
                    <ActionVoice 
                      className={`${isRecording ? 'text-red-500 animate-pulse' : 'text-command-primary'}`} 
                      size="lg" 
                    />
                  </motion.div>
                  <Dialog.Title className="text-xl font-semibold text-command-text">
                    Voice Memo
                  </Dialog.Title>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="p-2 rounded-lg text-command-muted hover:text-command-text hover:bg-command-background transition-all"
                >
                  <NavClose size="md" />
                </motion.button>
              </div>

              <div className="space-y-6">
                {/* Recording Controls */}
                <div className="flex justify-center">
                  {!isRecording ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startRecording}
                      className="w-20 h-20 bg-command-primary hover:bg-command-primary/90 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      <ActionPlay size="xl" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={stopRecording}
                      className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all animate-pulse"
                    >
                      <ActionPause size="xl" />
                    </motion.button>
                  )}
                </div>

                {/* Status */}
                <div className="text-center">
                  <p className="text-command-muted text-sm">
                    {isRecording ? 'Recording... Speak now' : 'Click to start recording'}
                  </p>
                  {isRecording && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 flex justify-center space-x-1"
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            scaleY: [1, 2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                          className="w-1 h-4 bg-red-500 rounded-full"
                        />
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Transcript */}
                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-command-background border border-command-border rounded-lg p-4 max-h-32 overflow-y-auto"
                  >
                    <h4 className="text-sm font-medium text-command-text mb-2">Transcript:</h4>
                    <p className="text-command-muted text-sm leading-relaxed">
                      {transcript}
                    </p>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 bg-command-background border border-command-border text-command-muted rounded-lg hover:border-command-muted transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveVoiceMemo}
                    disabled={!transcript.trim() || isRecording}
                    className="flex-1 px-4 py-3 bg-command-primary text-white rounded-lg hover:bg-command-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <ActionComplete size="sm" />
                    Save Memo
                  </motion.button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}