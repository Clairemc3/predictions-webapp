import React from 'react';
import ExactMatchPoints from './point-assignment-types/ExactMatchPoints';
import ClosestWinsPoints from './point-assignment-types/ClosestWinsPoints';
import PositionWithProximityPoints from './point-assignment-types/PositionWithProximityPoints';

interface PointAssignmentProps {
  scoringType?: string;
  answerCount?: number | string;
  setData?: (callback: (prevData: any) => any) => void;
  currentScoringPoints?: Record<string, number | string>;
  errors?: Record<string, string>;
}

const componentMap: Record<string, React.ComponentType<any>> = {
  exact_match: ExactMatchPoints,
  closest_wins: ClosestWinsPoints,
  position_with_proximity: PositionWithProximityPoints,
};

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

  const Component = componentMap[scoringType];

  if (!Component) {
    return null;
  }

  return (
    <Component
      answerCount={answerCount}
      setData={setData}
      currentScoringPoints={currentScoringPoints}
      errors={errors}
    />
  );
};

export default PointAssignment;
