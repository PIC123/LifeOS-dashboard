'use client';

import {
  CheckCircleIcon,
  ClockIcon,
  CogIcon,
  DocumentTextIcon,
  MicrophoneIcon,
  BellIcon,
  ChartBarIcon,
  CalendarIcon,
  WifiIcon,
  BatteryIcon,
  CloudIcon,
  SunIcon,
  MoonIcon,
  LightBulbIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowRightIcon,
  PlusIcon,
  XMarkIcon,
  Bars3Icon,
  EyeIcon,
  HeartIcon,
  StarIcon,
  FireIcon,
  BeakerIcon,
  CpuChipIcon,
  CommandLineIcon,
  RocketLaunchIcon,
  SparklesIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

import {
  CheckCircleIcon as CheckCircleIconSolid,
  ClockIcon as ClockIconSolid,
  SunIcon as SunIconSolid,
  MoonIcon as MoonIconSolid,
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
  FireIcon as FireIconSolid,
  TrophyIcon as TrophyIconSolid
} from '@heroicons/react/24/solid';

interface IconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
};

// Status Icons
export const StatusOnline = ({ className = '', size = 'md' }: IconProps) => (
  <WifiIcon className={`${sizeClasses[size]} ${className}`} />
);

export const StatusBattery = ({ className = '', size = 'md' }: IconProps) => (
  <BatteryIcon className={`${sizeClasses[size]} ${className}`} />
);

export const StatusCloud = ({ className = '', size = 'md' }: IconProps) => (
  <CloudIcon className={`${sizeClasses[size]} ${className}`} />
);

// Time Icons
export const TimeDay = ({ className = '', size = 'md' }: IconProps) => (
  <SunIconSolid className={`${sizeClasses[size]} ${className}`} />
);

export const TimeNight = ({ className = '', size = 'md' }: IconProps) => (
  <MoonIconSolid className={`${sizeClasses[size]} ${className}`} />
);

export const TimeClock = ({ className = '', size = 'md' }: IconProps) => (
  <ClockIcon className={`${sizeClasses[size]} ${className}`} />
);

// Action Icons
export const ActionComplete = ({ className = '', size = 'md' }: IconProps) => (
  <CheckCircleIcon className={`${sizeClasses[size]} ${className}`} />
);

export const ActionCompleteSolid = ({ className = '', size = 'md' }: IconProps) => (
  <CheckCircleIconSolid className={`${sizeClasses[size]} ${className}`} />
);

export const ActionNote = ({ className = '', size = 'md' }: IconProps) => (
  <DocumentTextIcon className={`${sizeClasses[size]} ${className}`} />
);

export const ActionVoice = ({ className = '', size = 'md' }: IconProps) => (
  <MicrophoneIcon className={`${sizeClasses[size]} ${className}`} />
);

export const ActionSettings = ({ className = '', size = 'md' }: IconProps) => (
  <CogIcon className={`${sizeClasses[size]} ${className}`} />
);

export const ActionPlay = ({ className = '', size = 'md' }: IconProps) => (
  <PlayIcon className={`${sizeClasses[size]} ${className}`} />
);

export const ActionPause = ({ className = '', size = 'md' }: IconProps) => (
  <PauseIcon className={`${sizeClasses[size]} ${className}`} />
);

// Navigation Icons
export const NavArrowRight = ({ className = '', size = 'md' }: IconProps) => (
  <ArrowRightIcon className={`${sizeClasses[size]} ${className}`} />
);

export const NavAdd = ({ className = '', size = 'md' }: IconProps) => (
  <PlusIcon className={`${sizeClasses[size]} ${className}`} />
);

export const NavClose = ({ className = '', size = 'md' }: IconProps) => (
  <XMarkIcon className={`${sizeClasses[size]} ${className}`} />
);

export const NavMenu = ({ className = '', size = 'md' }: IconProps) => (
  <Bars3Icon className={`${sizeClasses[size]} ${className}`} />
);

// Data Icons
export const DataChart = ({ className = '', size = 'md' }: IconProps) => (
  <ChartBarIcon className={`${sizeClasses[size]} ${className}`} />
);

export const DataCalendar = ({ className = '', size = 'md' }: IconProps) => (
  <CalendarIcon className={`${sizeClasses[size]} ${className}`} />
);

export const DataNotification = ({ className = '', size = 'md' }: IconProps) => (
  <BellIcon className={`${sizeClasses[size]} ${className}`} />
);

// Achievement Icons
export const AchievementStreak = ({ className = '', size = 'md' }: IconProps) => (
  <FireIconSolid className={`${sizeClasses[size]} ${className}`} />
);

export const AchievementTrophy = ({ className = '', size = 'md' }: IconProps) => (
  <TrophyIconSolid className={`${sizeClasses[size]} ${className}`} />
);

export const AchievementStar = ({ className = '', size = 'md' }: IconProps) => (
  <StarIconSolid className={`${sizeClasses[size]} ${className}`} />
);

// System Icons
export const SystemCpu = ({ className = '', size = 'md' }: IconProps) => (
  <CpuChipIcon className={`${sizeClasses[size]} ${className}`} />
);

export const SystemTerminal = ({ className = '', size = 'md' }: IconProps) => (
  <CommandLineIcon className={`${sizeClasses[size]} ${className}`} />
);

export const SystemRocket = ({ className = '', size = 'md' }: IconProps) => (
  <RocketLaunchIcon className={`${sizeClasses[size]} ${className}`} />
);

// Special Effects
export const EffectSparkles = ({ className = '', size = 'md' }: IconProps) => (
  <SparklesIcon className={`${sizeClasses[size]} ${className}`} />
);

export const EffectBrain = ({ className = '', size = 'md' }: IconProps) => (
  <BeakerIcon className={`${sizeClasses[size]} ${className}`} />
);

export const EffectInsight = ({ className = '', size = 'md' }: IconProps) => (
  <LightBulbIcon className={`${sizeClasses[size]} ${className}`} />
);

export const EffectHeart = ({ className = '', size = 'md' }: IconProps) => (
  <HeartIconSolid className={`${sizeClasses[size]} ${className}`} />
);