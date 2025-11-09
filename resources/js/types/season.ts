// Season-related types and interfaces

export interface Season {
  id: number;
  name: string;
  description?: string | null;
  status?: string;
  is_host?: boolean;
  members?: Member[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  pivot?: {
    is_host: boolean;
  };
}

export interface Member {
  id: number;
  name: string;
  email: string;
  membership: {
    is_host: boolean;
      completed_questions_count: number;
  };
}

export interface Question {
  id: number;
  title: string;
  short_title?: string;
  type?: string;
  base_type?: string;
  answer_count?: number;
  answer_category?: string;
  entities?: Array<{
    id: number;
    entity_id: number;
    category_id: number;
  }>;
}

export interface QuestionRow {
  id: number;
  title: string;
  type?: string;
  base_type?: string;
}

// Page Props interfaces
export interface ManageSeasonProps {
  season: Season;
  seasonStatus: string;
  questions: Question[];
  totalQuestions: number;
}

export interface QuestionsTabProps {
  seasonId: number;
  questions: QuestionRow[];
}

export interface MembersTabProps {
  members?: Member[];
  seasonId: number;
  totalQuestions: number;
}

export interface SeasonCardProps {
  season: Season;
}

export interface SeasonsGridProps {
  seasons: Season[];
}