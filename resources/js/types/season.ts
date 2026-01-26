// Season-related types and interfaces

export interface Season {
  id: number;
  name: string;
  description?: string | null;
  status?: string;
  is_host?: boolean;
  members?: Member[];
  permissions: {
    canUpdateSeasonStatus: boolean;
    canInviteMembers: boolean;
    canCreateQuestions: boolean;
  };
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
  permissions: any;
  id: number;
  name: string;
  email: string;
  membership: {
    id: number;
    is_host: boolean;
    number_of_answers: number;
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
    name?: string;
    pivot?: {
      category_id: number;
    };
  }>;
}

export interface QuestionRow {
  id: number;
  title: string;
  type?: string;
  base_type?: string;
  permissions: {
    canUpdateQuestion: boolean;
    canDeleteQuestion: boolean;
    canViewQuestion: boolean;
  };
}

// Page Props interfaces
export interface ManageSeasonProps {
  season: Season;
  seasonStatus: string;
  questions: QuestionRow[];
  totalRequiredAnswers: number;
  permissions: {
    canUpdateSeasonStatus: boolean;
    canInviteMembers: boolean;
    canCreateQuestions: boolean;
  };
  members: Member[];
  excludedMembers: Member[];
  excludedMembersCount: number;
}

export interface QuestionsTabProps {
  seasonId: number;
  questions: QuestionRow[];
  canCreateQuestions: boolean;
}

export interface MembersTabProps {
  members?: Member[];
  excludedMembers?: Member[];
  excludedMembersCount: number;
  seasonId: number;
  totalRequiredAnswers: number;
  canInviteMembers: boolean;
}

export interface SeasonCardProps {
  season: Season;
}

export interface SeasonsGridProps {
  seasons: Season[];
}