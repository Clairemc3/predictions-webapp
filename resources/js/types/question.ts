

export interface QuestionType {
  key: string;
  type: string;
  label: string;
  shortDescription: string;
  description: string;
  base: string;
  answerCategoryFilters: any[];
  answerCategory: string | null;
  answerCountLabel: string | null;
  answerCountHelperText: string | null;
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