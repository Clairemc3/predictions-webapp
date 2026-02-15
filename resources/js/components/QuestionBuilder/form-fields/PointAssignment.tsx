import React from 'react';
import ExactMatchPoints from './point-assignment-types/ExactMatchPoints';
import PositionWithProximityPoints from './point-assignment-types/PositionWithProximityPoints';

interface PointAssignmentProps {
  scoringType?: string;
  answerCount?: number | string;
  setData?: (callback: (prevData: any) => any) => void;
  currentScoringPoints?: Record<string, number | string>;
}

const PointAssignment: React.FC<PointAssignmentProps> = ({
  scoringType,
  answerCount,
  setData,
  currentScoringPoints = {},
}) => {
  if (!scoringType) {
    return null;
  }
  if (scoringType === 'exact_match') {
    return (
      <ExactMatchPoints
        setData={setData}
        currentScoringPoints={currentScoringPoints}
      />
    );
  }

  if (scoringType === 'position_with_proximity') {
    return (
      <PositionWithProximityPoints
        answerCount={answerCount}
        setData={setData}
        currentScoringPoints={currentScoringPoints}
      />
    );
  }

  return null;
};

export default PointAssignment;
