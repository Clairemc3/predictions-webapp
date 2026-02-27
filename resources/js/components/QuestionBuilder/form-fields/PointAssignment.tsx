import React from 'react';
import ExactMatchPoints from './point-assignment-types/ExactMatchPoints';
import PositionWithProximityPoints from './point-assignment-types/PositionWithProximityPoints';

interface PointAssignmentProps {
  scoringType?: string;
  answerCount?: number | string;
  setData?: (callback: (prevData: any) => any) => void;
  currentScoringPoints?: Record<string, number | string>;
  errors?: Record<string, string>;
}

const PointAssignment: React.FC<PointAssignmentProps> = ({
  scoringType,
  answerCount,
  setData,
  currentScoringPoints = {},
  errors = {},
}) => {
  if (!scoringType) {
    return null;
  }
  if (scoringType === 'exact_match') {
    return (
      <ExactMatchPoints
        setData={setData}
        currentScoringPoints={currentScoringPoints}
        errors={errors}
      />
    );
  }

  if (scoringType === 'position_with_proximity') {
    return (
      <PositionWithProximityPoints
        answerCount={answerCount}
        setData={setData}
        currentScoringPoints={currentScoringPoints}
        errors={errors}
      />
    );
  }

  return null;
};

export default PointAssignment;
