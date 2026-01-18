'use client';
import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import ResumeSection from '@/components/ResumeSection';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useResume } from '@/context/ResumeContext';
import { Typography } from '@mui/material';

export default function ResumeBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTemplate = searchParams.get('templateId');

  const {
    resumeData,
    updatePersonalDetails,
    updateProfessionalSummary,
    addJobExperience,
    updateJobExperience,
    removeJobExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addProject,
    updateProject,
    removeProject,
    updateSkills,
  } = useResume();

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const extractedData = await response.json();
        console.log('Extracted data:', extractedData);
        
        // Clear existing data before populating with new data
        resumeData.employmentHistory.forEach((_, i) => removeJobExperience(i));
        resumeData.education.forEach((_, i) => removeEducation(i));
        resumeData.projects.forEach((_, i) => removeProject(i));

        updatePersonalDetails(extractedData.personalDetails);
        updateProfessionalSummary(extractedData.professionalSummary);
        extractedData.employmentHistory.forEach((job: any) => addJobExperience(job));
        extractedData.education.forEach((edu: any) => addEducation(edu));
        extractedData.projects.forEach((project: any) => addProject(project));
        updateSkills(extractedData.skills);
      } else {
        console.error('Failed to parse resume');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('resume-content');
    if (element) {
      const html2pdf = (await import('html2pdf.js')).default;
      html2pdf().from(element).save();
    }
  };

  React.useEffect(() => {
    if (!selectedTemplate) {
      // If no template is selected, redirect back to the templates page
      router.push('/templates');
    }
  }, [selectedTemplate, router]);

  if (!selectedTemplate) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <MainLayout>
        <Typography variant="h5" gutterBottom>
          Building Resume with {selectedTemplate} template
        </Typography>

        <ResumeSection title="Upload and Parse CV">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button variant="contained" component="label">
              Choose File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>
            <Button variant="outlined" onClick={handleFileUpload} disabled={!selectedFile}>
              Upload and Parse
            </Button>
            {selectedFile && <Typography>{selectedFile.name}</Typography>}
          </Box>
        </ResumeSection>

        <ResumeSection title="Personal Details">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full Name"
              variant="outlined"
              fullWidth
              value={resumeData.personalDetails.fullName}
              onChange={(e) => updatePersonalDetails({ fullName: e.target.value })}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={resumeData.personalDetails.email}
              onChange={(e) => updatePersonalDetails({ email: e.target.value })}
            />
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              value={resumeData.personalDetails.phone}
              onChange={(e) => updatePersonalDetails({ phone: e.target.value })}
            />
            <TextField
              label="LinkedIn Profile"
              variant="outlined"
              fullWidth
              value={resumeData.personalDetails.linkedin}
              onChange={(e) => updatePersonalDetails({ linkedin: e.target.value })}
            />
          </Box>
        </ResumeSection>

        <ResumeSection title="Professional Summary">
          <TextField
            label="Summary"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={resumeData.professionalSummary}
            onChange={(e) => updateProfessionalSummary(e.target.value)}
          />
        </ResumeSection>

        <ResumeSection title="Employment History">
          {resumeData.employmentHistory.map((job, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
              <TextField
                label="Job Title"
                variant="outlined"
                fullWidth
                value={job.title}
                onChange={(e) => updateJobExperience(index, { title: e.target.value })}
              />
              <TextField
                label="Company"
                variant="outlined"
                fullWidth
                value={job.company}
                onChange={(e) => updateJobExperience(index, { company: e.target.value })}
              />
              <TextField
                label="City, State"
                variant="outlined"
                fullWidth
                value={job.cityState}
                onChange={(e) => updateJobExperience(index, { cityState: e.target.value })}
              />
              <TextField
                label="Start Date - End Date"
                variant="outlined"
                fullWidth
                value={job.dates}
                onChange={(e) => updateJobExperience(index, { dates: e.g.target.value })}
              />
              <TextField
                label="Responsibilities"
                variant="outlined"
                multiline
                rows={3}
                fullWidth
                value={job.responsibilities}
                onChange={(e) => updateJobExperience(index, { responsibilities: e.target.value })}
              />
              <Button variant="outlined" color="error" onClick={() => removeJobExperience(index)}>Remove Job</Button>
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={() => addJobExperience({ title: '', company: '', cityState: '', dates: '', responsibilities: '' })}
          >
            Add Another Job
          </Button>
        </ResumeSection>

        <ResumeSection title="Education">
          {resumeData.education.map((edu, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
              <TextField
                label="Degree"
                variant="outlined"
                fullWidth
                value={edu.degree}
                onChange={(e) => updateEducation(index, { degree: e.target.value })}
              />
              <TextField
                label="University"
                variant="outlined"
                fullWidth
                value={edu.university}
                onChange={(e) => updateEducation(index, { university: e.target.value })}
              />
              <TextField
                label="City, State"
                variant="outlined"
                fullWidth
                value={edu.cityState}
                onChange={(e) => updateEducation(index, { cityState: e.target.value })}
              />
              <TextField
                label="Graduation Date"
                variant="outlined"
                fullWidth
                value={edu.graduationDate}
                onChange={(e) => updateEducation(index, { graduationDate: e.target.value })}
              />
              <Button variant="outlined" color="error" onClick={() => removeEducation(index)}>Remove Education</Button>
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={() => addEducation({ degree: '', university: '', cityState: '', graduationDate: '' })}
          >
            Add Another Education
          </Button>
        </ResumeSection>

        <ResumeSection title="Skills">
          <TextField
            label="Skills (comma separated)"
            variant="outlined"
            fullWidth
            value={resumeData.skills}
            onChange={(e) => updateSkills(e.target.value)}
          />
          {/* Potentially add an "Add Skill" button later for individual skill management */}
        </ResumeSection>

        <ResumeSection title="Projects">
          {resumeData.projects.map((project, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
              <TextField
                label="Project Name"
                variant="outlined"
                fullWidth
                value={project.name}
                onChange={(e) => updateProject(index, { name: e.target.value })}
              />
              <TextField
                label="Technologies Used"
                variant="outlined"
                fullWidth
                value={project.technologies}
                onChange={(e) => updateProject(index, { technologies: e.target.value })}
              />
              <TextField
                label="Description"
                variant="outlined"
                multiline
                rows={3}
                fullWidth
                value={project.description}
                onChange={(e) => updateProject(index, { description: e.target.value })}
              />
              <Button variant="outlined" color="error" onClick={() => removeProject(index)}>Remove Project</Button>
            </Box>
          ))}
          <Button
            variant="outlined"
            onClick={() => addProject({ name: '', technologies: '', description: '' })}
          >
            Add Another Project
          </Button>
        </ResumeSection>
      </MainLayout>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" color="primary" onClick={handleDownloadPdf}>
          Download PDF
        </Button>
      </Box>
    </>
  );
}
