import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
  Typography,
} from '@mui/material';

interface PositionWithProximityPointsProps {
  answerCount?: number | string;
  setData?: (callback: (prevData: any) => any) => void;
  currentScoringPoints?: Record<string, number | string>;
}

const PositionWithProximityPoints: React.FC<PositionWithProximityPointsProps> = ({
  answerCount,
  setData,
  currentScoringPoints = {},
}) => {
  const parsedAnswerCount = typeof answerCount === 'string' ? parseInt(answerCount, 10) : answerCount;

  if (!parsedAnswerCount || Number.isNaN(parsedAnswerCount)) {
    return null;
  }

  const maxOffset = Math.floor(parsedAnswerCount / 2);
  const availableOffsets = Array.from({ length: maxOffset + 1 }, (_, index) => index);
  const currentOffsets = Object.keys(currentScoringPoints)
    .map((key) => parseInt(key, 10))
    .filter((value) => !Number.isNaN(value) && value >= 0)
    .sort((a, b) => a - b);
  const highestCurrentOffset = currentOffsets.length > 0 ? currentOffsets[currentOffsets.length - 1] : 0;
  const [visibleMaxOffset, setVisibleMaxOffset] = React.useState<number>(Math.min(highestCurrentOffset, maxOffset));

  const handleOffsetChange = (offset: number, value: string) => {
    if (setData) {
      setData((prevData: any) => ({
        ...prevData,
        scoring_points: {
          ...(prevData.scoring_points || {}),
          [offset]: value === '' ? '' : parseInt(value, 10),
        },
      }));
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend">Point Assignment</FormLabel>
        <FormHelperText sx={{ mb: 2 }}>
          Set points for exact and nearby positions (up to {maxOffset} positions out).
        </FormHelperText>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          {availableOffsets
            .filter((offset) => offset <= visibleMaxOffset)
            .map((offset) => (
              <Box key={offset}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {offset === 0 ? 'Exact position' : `${offset} place${offset === 1 ? '' : 's'} off`}
                </Typography>
                <TextField
                  label="Points"
                  name={`scoring_points_${offset}`}
                  type="number"
                  value={currentScoringPoints[offset] ?? ''}
                  onChange={(event) => handleOffsetChange(offset, event.target.value)}
                  size="small"
                  slotProps={{
                    htmlInput: {
                      min: 0,
                    },
                  }}
                  sx={{ maxWidth: 200 }}
                />
              </Box>
            ))}
        </Box>
        {visibleMaxOffset < maxOffset && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setVisibleMaxOffset((prev) => Math.min(prev + 1, maxOffset))}
            >
              Points awarded for {visibleMaxOffset + 1} place{visibleMaxOffset + 1 === 1 ? '' : 's'} off
            </Button>
          </Box>
        )}
      </FormControl>
    </Box>
  );
};

export default PositionWithProximityPoints;
