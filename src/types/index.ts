
export interface Report {
  id: string;
  anonymousUserId: string;
  dateOfIncidence: string; // ISO string date
  location: string; // For simplicity, a string address. Could be { lat: number, lng: number }
  typeOfIncidence: ReportType;
  description: string;
  mediaProof?: {
    name: string;
    type: string; // MIME type
    // dataUri?: string; // Optional: if we were to handle file uploads
  };
  submittedAt: string; // ISO string date
  status: 'Pending' | 'Reviewed' | 'ActionTaken';
  aiPrioritization?: {
    severityScore: number;
    reasoning: string;
    actionable: boolean;
  };
  // For geo queries, a geohash or lat/lng would be stored if using real geolocation
}

export type ReportType = 'Wage Theft' | 'Safety Violation' | 'Unfair Wages' | 'Unsafe Working Conditions' | 'Other';

export const reportTypes: ReportType[] = ['Wage Theft', 'Safety Violation', 'Unfair Wages', 'Unsafe Working Conditions', 'Other'];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: React.ElementType;
  imageUrl?: string;
}

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export type Language = 'en' | 'hi';
