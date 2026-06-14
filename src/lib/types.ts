export type JobStatus = 'open' | 'closed' | 'draft';
export type CandidateStatus = 'pending' | 'passed' | 'rejected' | 'offer' | 'hired';
export type InterviewRound = 'first' | 'second' | 'final';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  salary: string;
  requirements: string[];
  status: JobStatus;
  createdAt: string;
  candidateCount: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string;
  jobTitle: string;
  status: CandidateStatus;
  score: number;
  education: string;
  experience: string;
  skills: string[];
  currentSalary: string;
  expectedSalary: string;
  avatar: string;
  resumeUrl?: string;
  screeningResult?: ScreeningResult;
  createdAt: string;
}

export interface ScreeningResult {
  hardScore: number;
  softScore: number;
  totalScore: number;
  level: 'pass' | 'pending' | 'reject';
  details: {
    education: { score: number; verified: boolean; note: string };
    experience: { score: number; note: string };
    skills: { score: number; matched: string[]; missing: string[] };
    salary: { score: number; note: string };
    potential: { score: number; note: string };
  };
}

export interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  goodAnswer: string;
  mediumAnswer: string;
  poorAnswer: string;
  tips: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  round: InterviewRound;
  scheduledAt: string;
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  evaluation?: InterviewEvaluation;
}

export interface InterviewEvaluation {
  overallScore: number;
  ability: { score: number; comment: string };
  personality: { score: number; comment: string };
  emotion: { score: number; comment: string };
  aiSuggestion: string;
  hrSuggestion: string;
  finalDecision: 'pass' | 'pending' | 'reject';
}

export interface OfferRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  proposedSalary: string;
  status: 'pending' | 'accepted' | 'negotiating' | 'rejected';
  negotiationAdvice: string;
  riskAssessment: string;
  createdAt: string;
}

export interface ReviewRecord {
  id: string;
  interviewer: string;
  interviewCount: number;
  averageScore: number;
  strengths: string[];
  improvements: string[];
  aiSuggestion: string;
}

export interface DashboardStats {
  totalJobs: number;
  openJobs: number;
  totalCandidates: number;
  todayNew: number;
  interviewsToday: number;
  pendingOffers: number;
  passRate: number;
  avgScreeningScore: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: 'candidate' | 'interview' | 'offer' | 'screening';
  message: string;
  time: string;
}

export interface Settings {
  weights: {
    education: number;
    experience: number;
    skills: number;
    salary: number;
    potential: number;
  };
  thresholds: {
    pass: number;
    reject: number;
  };
  autoScreening: boolean;
  aiAssistance: boolean;
}
