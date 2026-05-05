import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { route } from '../../../lib/routes';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import AuthLayout from '../../../layouts/AuthLayout';
import QuestionTypeBasicFields from './question-type-builder/QuestionTypeBasicFields';
import QuestionTypeAnswerFilters from './question-type-builder/QuestionTypeAnswerFilters';
import QuestionTypeScoringTypes from './question-type-builder/QuestionTypeScoringTypes';

interface Category {
  id: number;
  name: string;
}

interface QuestionType {
  id: number;
  application_context: string;
  key: string;
  base_type: string;
  label: string;
  short_description: string;
  description: string;
  answer_category_id: number | null;
  answer_count_label: string | null;
  answer_count_helper_text: string | null;
  fixed_answer_count: number | null;
  is_active: boolean;
  display_order: number;
  answer_filters: Array<{
    category_id: number;
    label: string;
    description: string | null;
    filters: Record<string, string>;
  }>;  scoring_types: Array<{
    value: string;
    description: string | null;
  }>;
}

interface PageProps {
  questionType: QuestionType;
  categories: Category[];
  applicationContexts: { label: string; value: string }[];
  baseTypes: string[];
  availableScoringTypes: { value: string; label: string }[];
}

const Edit = ({ questionType, categories, applicationContexts, baseTypes, availableScoringTypes }: PageProps) => {
  // Initialize saved descriptions from existing data
  const [savedDescriptions, setSavedDescriptions] = useState<Record<string, string>>(
    questionType.scoring_types.reduce((acc, st) => ({ ...acc, [st.value]: st.description || '' }), {})
  );
  
  const { data, setData, put, processing, errors } = useForm({
    application_context: questionType.application_context,
    key: questionType.key,
    base_type: questionType.base_type,
    label: questionType.label,
    short_description: questionType.short_description,
    description: questionType.description,
    answer_category_id: questionType.answer_category_id?.toString() || '',
    answer_count_label: questionType.answer_count_label || '',
    answer_count_helper_text: questionType.answer_count_helper_text || '',
    fixed_answer_count: questionType.fixed_answer_count?.toString() || '',
    is_active: questionType.is_active,
    display_order: questionType.display_order,
    answer_filters: questionType.answer_filters.map(f => ({
      category_id: f.category_id.toString(),
      label: f.label,
      description: f.description || '',
      filters: f.filters || {},
    })),
    scoring_types: questionType.scoring_types.map(st => ({
      value: st.value,
      description: st.description || '',
    })),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.question-types.update', { id: questionType.id }));
  };

  const addAnswerFilter = () => {
    setData('answer_filters', [
      ...data.answer_filters,
      { category_id: '', label: '', description: '', filters: {} },
    ]);
  };

  const removeAnswerFilter = (index: number) => {
    setData(
      'answer_filters',
      data.answer_filters.filter((_, i) => i !== index)
    );
  };

  const updateAnswerFilter = (index: number, field: string, value: any) => {
    const updated = [...data.answer_filters];
    updated[index] = { ...updated[index], [field]: value };
    setData('answer_filters', updated);
  };

  const toggleScoringType = (value: string) => {
    const existing = data.scoring_types.find(st => st.value === value);
    if (existing) {
      // Save the description before removing
      if (existing.description) {
        setSavedDescriptions(prev => ({ ...prev, [value]: existing.description }));
      }
      setData('scoring_types', data.scoring_types.filter(st => st.value !== value));
    } else {
      // Restore saved description if available
      const description = savedDescriptions[value] || '';
      setData('scoring_types', [...data.scoring_types, { value, description }]);
    }
  };

  return (
    <AuthLayout>
      <Head title={`Edit Question Type - ${questionType.label}`} />

      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Edit Question Type
      </Typography>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <QuestionTypeBasicFields
              data={data}
              errors={errors}
              categories={categories}
              applicationContexts={applicationContexts}
              baseTypes={baseTypes}
              onChange={(field, value) => setData(field as any, value)}
            />

            <QuestionTypeAnswerFilters
              answerFilters={data.answer_filters}
              categories={categories}
              onAdd={addAnswerFilter}
              onRemove={removeAnswerFilter}
              onUpdate={updateAnswerFilter}
            />

            <QuestionTypeScoringTypes
              scoringTypes={data.scoring_types}
              availableScoringTypes={availableScoringTypes}
              onToggle={toggleScoringType}
              onUpdateDescription={(value, description) => {
                const updated = data.scoring_types.map(st =>
                  st.value === value ? { ...st, description } : st
                );
                setData('scoring_types', updated);
              }}
            />

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" disabled={processing}>
                Update Question Type
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.visit(route('admin.question-types.index'))}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default Edit;
