'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of a single job experience
interface JobExperience {
  title: string;
  company: string;
  cityState: string;
  dates: string;
  responsibilities: string;
}

// Define the shape of a single education entry
interface Education {
  degree: string;
  university: string;
  cityState: string;
  graduationDate: string;
}

// Define the shape of a single project
interface Project {
  name: string;
  technologies: string;
  description: string;
}

// Define the shape of the resume data
interface ResumeData {
  personalDetails: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
  };
  professionalSummary: string;
  employmentHistory: JobExperience[];
  education: Education[];
  projects: Project[];
  skills: string; // comma separated for now
}

// Define the shape of the context value
interface ResumeContextType {
  resumeData: ResumeData;
  updatePersonalDetails: (details: Partial<ResumeData['personalDetails']>) => void;
  updateProfessionalSummary: (summary: string) => void;
  addJobExperience: (job: JobExperience) => void;
  updateJobExperience: (index: number, job: Partial<JobExperience>) => void;
  removeJobExperience: (index: number) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (index: number, edu: Partial<Education>) => void;
  removeEducation: (index: number) => void;
  addProject: (project: Project) => void;
  updateProject: (index: number, project: Partial<Project>) => void;
  removeProject: (index: number) => void;
  updateSkills: (skills: string) => void;
}

// Initial dummy data for the resume
const initialResumeData: ResumeData = {
  personalDetails: {
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
  },
  professionalSummary: '',
  employmentHistory: [],
  education: [],
  projects: [],
  skills: '',
};

// Create the context
const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Create the provider component
export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  const updatePersonalDetails = (details: Partial<ResumeData['personalDetails']>) => {
    setResumeData((prevData) => ({
      ...prevData,
      personalDetails: { ...prevData.personalDetails, ...details },
    }));
  };

  const updateProfessionalSummary = (summary: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      professionalSummary: summary,
    }));
  };

  const addJobExperience = (job: JobExperience) => {
    setResumeData((prevData) => ({
      ...prevData,
      employmentHistory: [...prevData.employmentHistory, job],
    }));
  };

  const updateJobExperience = (index: number, job: Partial<JobExperience>) => {
    setResumeData((prevData) => {
      const newEmploymentHistory = [...prevData.employmentHistory];
      newEmploymentHistory[index] = { ...newEmploymentHistory[index], ...job } as JobExperience;
      return { ...prevData, employmentHistory: newEmploymentHistory };
    });
  };

  const removeJobExperience = (index: number) => {
    setResumeData((prevData) => ({
      ...prevData,
      employmentHistory: prevData.employmentHistory.filter((_, i) => i !== index),
    }));
  };

  const addEducation = (edu: Education) => {
    setResumeData((prevData) => ({
      ...prevData,
      education: [...prevData.education, edu],
    }));
  };

  const updateEducation = (index: number, edu: Partial<Education>) => {
    setResumeData((prevData) => {
      const newEducation = [...prevData.education];
      newEducation[index] = { ...newEducation[index], ...edu } as Education;
      return { ...prevData, education: newEducation };
    });
  };

  const removeEducation = (index: number) => {
    setResumeData((prevData) => ({
      ...prevData,
      education: prevData.education.filter((_, i) => i !== index),
    }));
  };

  const addProject = (project: Project) => {
    setResumeData((prevData) => ({
      ...prevData,
      projects: [...prevData.projects, project],
    }));
  };

  const updateProject = (index: number, project: Partial<Project>) => {
    setResumeData((prevData) => {
      const newProjects = [...prevData.projects];
      newProjects[index] = { ...newProjects[index], ...project } as Project;
      return { ...prevData, projects: newProjects };
    });
  };

  const removeProject = (index: number) => {
    setResumeData((prevData) => ({
      ...prevData,
      projects: prevData.projects.filter((_, i) => i !== index),
    }));
  };

  const updateSkills = (skills: string) => {
    setResumeData((prevData) => ({
      ...prevData,
      skills: skills,
    }));
  };

  const value = {
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
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

// Custom hook to use the ResumeContext
export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
