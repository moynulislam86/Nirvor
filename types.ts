import React from 'react';

export type Language = 'bn' | 'en';

export interface ServiceItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  path: string;
  color: string;
}

export interface EmergencyContact {
  name: string;
  number: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  groundingMetadata?: any;
  audioData?: string;
}

export interface LocationData {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  type: 'private' | 'govt';
  website?: string;
}

export interface GuideStep {
  text: string;
}

export interface GuideItem {
  title: string;
  description?: string;
  steps: GuideStep[];
  website?: string;
}

export interface HealthGuideItem {
  title: string;
  symptoms: string;
  action: string;
  warning: string;
}

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  website?: string;
  phone?: string; // Added phone field
}

export interface SkillResource {
  id: string;
  title: string;
  provider: string;
  duration: string;
  description: string;
  type: 'online' | 'offline';
  website?: string;
}

export interface TransportService {
  name: string;
  type: string;
  phone: string;
  location: string;
  website?: string;
}

// Updated Community Interfaces
export interface CommunityItem {
    id: string;
    name: string;
    type: 'volunteer' | 'blood' | 'donation';
    role: string;
    description: string;
    location: string;
    contact: string;
    bloodGroup?: string;
    lastActive?: string;
    verified?: boolean;
    totalHelped?: number;
    website?: string; 
    donationDetails?: string; 
}

export interface CommunityEvent {
    id: string;
    title: string;
    date: string; // ISO string or relative
    time: string;
    location: string;
    district: string;
    description: string;
    organizer: string;
    contact: string;
    type: 'medical' | 'relief' | 'education' | 'other';
}

export interface Specialist {
    id: string;
    name: string;
    specialty: 'gynecologist' | 'pediatrician';
    location: string;
    phone: string;
    hospital: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

// New Interface for Doctor Directory
export interface DoctorProfile {
    id: string;
    name: string;
    degrees: string;
    specialty: string;
    designation: string; // Podobi
    hospital: string;
    district: string;
    phone: string;
    fee?: string;
    visitingHours?: string;
}

export interface LanguageData {
  hospitals: Hospital[];
  healthGuides: HealthGuideItem[];
  faqs: FAQItem[];
  legalGuides: GuideItem[];
  govtGuides: GuideItem[];
  medicineInfo: { title: string; description: string; }[];
  psychologyTips: { title: string; description: string; }[];
  womenSafety: { title: string; description: string; }[];
  jobs: JobItem[];
  skillResources: SkillResource[];
  transportServices: TransportService[];
  seniorServices: GuideItem[];
  communityHelpers: CommunityItem[];
  communityEvents: CommunityEvent[]; // New
  womenSpecialists: Specialist[];
  notifications: Notification[];
  doctors: DoctorProfile[]; // New
}

export interface AppData {
  bn: LanguageData;
  en: LanguageData;
}

export interface LinkedAccount {
    id: string;
    type: 'mfs' | 'bank';
    provider: string; 
    number: string;
}

export interface Transaction {
    id: string;
    service: string;
    provider: string;
    amount: string;
    date: string;
    method: string;
    recipient: string;
    status: 'Success' | 'Failed';
}

// Toast Interface
export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
}

export enum PageRoutes {
  HOME = '/',
  EMERGENCY = '/emergency',
  HEALTH = '/health',
  LEGAL = '/legal',
  GOVT = '/govt',
  DISASTER = '/disaster',
  CHAT = '/chat',
  PSYCHOLOGY = '/psychology',
  WOMEN_CHILD = '/women-child',
  SENIOR = '/senior',
  TRANSPORT = '/transport',
  JOBS = '/jobs',
  COMMUNITY = '/community',
  PAYMENT = '/payment',
  FIND_DOCTOR = '/find-doctor', // New Route
}