'use client';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface ResumeSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function ResumeSection({ title, children }: ResumeSectionProps) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>
      <Box>{children}</Box>
    </Paper>
  );
}
