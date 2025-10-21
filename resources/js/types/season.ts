// Season-related types and interfaces

export interface Season {
  id: number;
  name: string;
  description?: string | null;
  status?: string;
  is_host?: boolean;
  members?: User[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  pivot?: {
    is_host: boolean;
  };
}

export interface Question {
  id: number;
  title: string;
  short_title?: string;
  type?: string;
  base_type?: string;
  answer_count?: number;
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
export interface EditSeasonProps {
  season: Season;
  seasonStatus: string;
  questions: Question[];
}

export interface QuestionsTabProps {
  seasonId: number;
  questions: QuestionRow[];
}

export interface MembersTabProps {
  season: Season;
}

export interface SeasonCardProps {
  season: Season;
}

export interface SeasonsGridProps {
  seasons: Season[];
}