import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import * as pdf from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    const data = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      const form = formidable({});
      form.parse(request as any, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const file = data.files.resume;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const firstFile = Array.isArray(file) ? file[0] : file;
    const filePath = firstFile.filepath;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);

    // For now, we are just returning the full text.
    // In a real application, you would parse this text to extract structured data.
    const extractedText = pdfData.text;
    console.log("Extracted Text:", extractedText);

    // A more sophisticated section-based parsing logic
    const sections = extractedText.split(/(EDUCATION|EXPERIENCE|PROJECTS|TECHNICAL SKILLS)\s/);
    console.log("Sections:", sections);
    
    let personalDetails = { fullName: '', email: '', phone: '', linkedin: '' };
    let education: any[] = [];
    let employmentHistory: any[] = [];
    let projects: any[] = [];
    let skills = '';

    // Personal details are usually at the beginning
    const personalDetailsSection = sections[0] || '';
    personalDetails.fullName = (personalDetailsSection.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/) || ['',''])[0];
    personalDetails.email = (personalDetailsSection.match(/[\w.-]+@[\w.-]+/) || ['',''])[0];
    personalDetails.phone = (personalDetailsSection.match(/\d{3}\s\d{3}\s\d{4}/) || ['',''])[0];
    personalDetails.linkedin = (personalDetailsSection.match(/linkedin.com\/in\/[\w-]+/) || ['',''])[0];

    for (let i = 1; i < sections.length; i += 2) {
      const sectionTitle = sections[i];
      const sectionContent = sections[i + 1] || '';
      console.log("Processing Section:", sectionTitle);
      console.log("Section Content:", sectionContent);

      if (sectionTitle === 'EDUCATION') {
        // This is a very basic way to parse education and can be improved
        const eduBlocks = sectionContent.split(/\n\s*\n/);
        eduBlocks.forEach(block => {
          const lines = block.split('\n');
          if(lines.length >= 2) {
            education.push({
              university: lines[0],
              degree: lines[1],
              cityState: '',
              graduationDate: ''
            });
          }
        });
      } else if (sectionTitle === 'EXPERIENCE') {
        const jobBlocks = sectionContent.split(/\n\s*\n/);
        jobBlocks.forEach(block => {
          const lines = block.split('\n');
          if (lines.length >= 2) {
            employmentHistory.push({
              title: lines[0],
              company: lines[1],
              cityState: '',
              dates: '',
              responsibilities: lines.slice(2).join('\n')
            });
          }
        });
      } else if (sectionTitle === 'PROJECTS') {
        const projectBlocks = sectionContent.split(/\n\s*\n/);
        projectBlocks.forEach(block => {
          const lines = block.split('\n');
          if (lines.length >= 2) {
            projects.push({
              name: lines[0],
              technologies: '', // Technologies are not easily parsed from the example
              description: lines.slice(1).join('\n')
            });
          }
        });
      } else if (sectionTitle === 'TECHNICAL SKILLS') {
        skills = sectionContent.trim();
      }
    }

    const extractedData = {
      personalDetails,
      professionalSummary: '', // Still not parsing this
      employmentHistory,
      education,
      projects,
      skills,
    };
    
    fs.unlinkSync(filePath); // Clean up the temporary file

    return NextResponse.json(extractedData);

  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json({ error: 'Failed to parse resume' }, { status: 500 });
  }
}
