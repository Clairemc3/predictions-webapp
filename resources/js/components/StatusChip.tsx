import { Chip } from '@mui/material';

interface StatusChipProps {
  status: string,
  size?: 'small' | 'medium';
}

const StatusChip = ({ status, size = 'small' }: StatusChipProps) => {
  // Convert status to string if it's not already (handles Enum objects)
  const statusString = typeof status === 'string' ? status : String(status);

  const getStatusChipColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'draft':
        return 'default';
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <Chip 
      label={getStatusLabel(statusString)}
      color={getStatusChipColor(statusString)}
      size={size}
    />
  );
};

export default StatusChip;
