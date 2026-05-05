

export interface QuestionTypeSummary {
  id: number;
  key: string;
  label: string;
  shortDescription: string;
  description: string;
}

export interface QuestionType {
  key: string;
  type: string;
  label: string;
  shortDescription: string;
  description: string;
  base: string;
  answerCategoryFilters: any[];
  answerCategory: string | null;
  answerCategoryId: number | null;
  answerCountLabel: string | null;
  answerCountHelperText: string | null;
  fixedAnswerCount: number | null;
  scoringTypes?: Array<{
    value: string;
    label: string;
    description: string;
  }>;
}

export interface QuestionOptionsProps {
  selectedQuestionType: QuestionType;
}

export interface RankingsProps {
  selectedQuestionType: QuestionType;
}

export interface EntitySelectionProps {
  selectedQuestionType: QuestionType;
}