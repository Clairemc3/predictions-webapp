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

interface PageProps {
  categories: Category[];
  applicationContexts: { label: string; value: string }[];
  baseTypes: string[];
  availableScoringTypes: { value: string; label: string }[];
}

const Create = ({ categories, applicationContexts, baseTypes, availableScoringTypes }: PageProps) => {
  const [savedDescriptions, setSavedDescriptions] = useState<Record<string, string>>({});
  
  const { data, setData, post, processing, errors } = useForm({
    application_context: applicationContexts[0]?.value || '',
    key: '',
    base_type: 'ranking',
    label: '',
    short_description: '',
    description: '',
    answer_category_id: '',
    answer_count_label: '',
    answer_count_helper_text: '',
    fixed_answer_count: '',
    is_active: true,
    display_order: 0,
    answer_filters: [] as Array<{
      category_id: string;
      label: string;
      description: string;
      filters: Record<string, string>;
    }>,
    scoring_types: [] as Array<{
      value: string;
      description: string;
    }>,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.question-types.store'));
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
      <Head title="Create Question Type" />

      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Create Question Type
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
                Create Question Type
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

export default Create;
