import React from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { URLFormData } from '../types';

interface URLInputProps {
  index: number;
  data: URLFormData;
  onChange: (index: number, field: keyof URLFormData, value: string) => void;
  errors: Record<string, string>;
}

const URLInput: React.FC<URLInputProps> = ({ index, data, onChange, errors }) => {
  return (
    <Box sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="subtitle1" gutterBottom>
        URL #{index + 1}
      </Typography>
      
      <TextField
        fullWidth
        label="Long URL *"
        value={data.longURL}
        onChange={(e) => onChange(index, 'longURL', e.target.value)}
        error={!!errors[`longURL_${index}`]}
        helperText={errors[`longURL_${index}`]}
        placeholder="https://example.com/very-long-url"
        sx={{ mb: 2 }}
      />
      
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Validity (minutes)"
          type="number"
          value={data.validityPeriod}
          onChange={(e) => onChange(index, 'validityPeriod', e.target.value)}
          error={!!errors[`validityPeriod_${index}`]}
          helperText={errors[`validityPeriod_${index}`] || 'Default: 30 minutes'}
          placeholder="30"
          inputProps={{ min: 1, max: 43200 }}
          sx={{ flex: 1 }}
        />
        
        <TextField
          label="Custom Shortcode"
          value={data.customShortcode}
          onChange={(e) => onChange(index, 'customShortcode', e.target.value)}
          error={!!errors[`customShortcode_${index}`]}
          helperText={errors[`customShortcode_${index}`] || '4-10 alphanumeric chars (optional)'}
          placeholder="abc123"
          inputProps={{ maxLength: 10 }}
          sx={{ flex: 1 }}
        />
      </Box>
    </Box>
  );
};

export default URLInput;