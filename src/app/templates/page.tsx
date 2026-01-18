'use client';
import * as React from 'react';
import MainLayout from '@/components/MainLayout';
import { Box, Typography, Grid, Card, CardActionArea, CardContent } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function TemplatesPage() {
  const router = useRouter();
  const templates = [
    { id: 'modern', name: 'Modern Template', description: 'A clean and professional design.' },
    { id: 'classic', name: 'Classic Template', description: 'A timeless and elegant layout.' },
    { id: 'creative', name: 'Creative Template', description: 'A vibrant and unique style.' },
  ];

  const handleTemplateSelect = (templateId: string) => {
    router.push(`/resume?templateId=${templateId}`);
  };

  return (
    <MainLayout>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Select Your Resume Template
        </Typography>
        <Grid container spacing={3}>
          {templates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card>
                <CardActionArea onClick={() => handleTemplateSelect(template.id)}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </MainLayout>
  );
}
