import React from 'react';
import { Typography, Box } from '@mui/material';
import StatsTable from '../components/StatsTable';

const StatsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Statistics & Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        View all your shortened URLs, click statistics, and detailed analytics.
      </Typography>
      <StatsTable />
    </Box>
  );
};

export default StatsPage;