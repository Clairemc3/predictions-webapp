export interface Answer {
  id: number;
  question_id: number;
  entity_id: number;
  order: number;
  value: string;
  entity_value?: string;
  entity_short_value?: string;
  entity_image_url?: string;
  points?: number;
  accuracy_level?: number | null;
  has_a_result?: boolean;
}
