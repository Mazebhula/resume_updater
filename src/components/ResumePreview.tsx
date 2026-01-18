'use client';
import * as React from 'react';
import { Box, Typography, Divider, Grid } from '@mui/material';
import { useResume } from '@/context/ResumeContext';

export default function ResumePreview() {
  const { resumeData } = useResume();

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, mb: 1 }}>{title}</Typography>
      <Divider sx={{ mb: 2 }} />
      {children}
    </Box>
  );

  return (
    <Box id="resume-content" sx={{ p: 4, backgroundColor: 'white', color: 'black', fontFamily: 'Merriweather, serif' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{resumeData.personalDetails.fullName || 'Your Name'}</Typography>
        <Typography variant="body1">
          {resumeData.personalDetails.phone}{resumeData.personalDetails.phone && ' | '}
          {resumeData.personalDetails.email}{resumeData.personalDetails.email && ' | '}
          {resumeData.personalDetails.linkedin}
        </Typography>
      </Box>

      {/* Education */}
      <Section title="Education">
        {resumeData.education.map((edu, index) => (
          <Grid container key={index} sx={{ mb: 2 }}>
            <Grid item xs={8}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{edu.university}</Typography>
              <Typography variant="subtitle1">{edu.degree}</Typography>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: 'right' }}>
              <Typography variant="body1">{edu.cityState}</Typography>
              <Typography variant="body1">{edu.graduationDate}</Typography>
            </Grid>
          </Grid>
        ))}
      </Section>

      {/* Experience */}
      <Section title="Experience">
        {resumeData.employmentHistory.map((job, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Grid container>
              <Grid item xs={8}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{job.title}</Typography>
                <Typography variant="subtitle1">{job.company}</Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography variant="body1">{job.cityState}</Typography>
                <Typography variant="body1">{job.dates}</Typography>
              </Grid>
            </Grid>
            {/* Using a simple list for responsibilities */}
            <Box component="ul" sx={{ pl: 2, mt: 1 }}>
              {job.responsibilities.split('\n').map((line, i) => (
                <Typography component="li" key={i} variant="body2">{line}</Typography>
              ))}
            </Box>
          </Box>
        ))}
      </Section>
      
      {/* Projects */}
      <Section title="Projects">
        {resumeData.projects.map((project, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Grid container>
              <Grid item xs={8}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{project.name}</Typography>
                <Typography variant="subtitle1">{project.technologies}</Typography>
              </Grid>
            </Grid>
            {/* Using a simple list for description */}
            <Box component="ul" sx={{ pl: 2, mt: 1 }}>
              {project.description.split('\n').map((line, i) => (
                <Typography component="li" key={i} variant="body2">{line}</Typography>
              ))}
            </Box>
          </Box>
        ))}
      </Section>

      {/* Skills */}
      <Section title="Technical Skills">
        <Typography variant="body1">{resumeData.skills}</Typography>
      </Section>
    </Box>
  );
}
