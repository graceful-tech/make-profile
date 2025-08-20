import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-resume-preview',
  standalone: false,
  templateUrl: './resume-preview.component.html',
  styleUrl: './resume-preview.component.css'
})
export class ResumePreviewComponent {
 @Input() candidate: any;
  // @Input() dummyCandidate: any;


  dummyCandidate: any = {
    name: 'John Doe',
    phone: '+91 1234567890',
    email: 'john.doe@example.com',
    linkedin: 'linkedin.com/in/johndoe',
    objective: 'To work in a challenging environment where I can utilize my skills and grow professionally.',
    summary: 'Passionate software engineer with 5+ years of experience in web development, building scalable applications, and collaborating in agile teams.',
    experiences: [
      {
        role: 'Software Engineer',
        companyName: 'ABC Technologies',
        experienceYearStartDate: '2018',
        experienceYearEndDate: '2022',
        responsibilities: 'Developed applications, wrote tests, collaborated with teams, optimized performance'
      },
      {
        role: 'Junior Developer',
        companyName: 'XYZ Solutions',
        experienceYearStartDate: '2016',
        experienceYearEndDate: '2018',
        responsibilities: 'Assisted in coding, debugging, and maintaining software projects'
      }
    ],
    skills: 'Angular, Java, Spring Boot, SQL, HTML, CSS, JavaScript',
    softSkills: 'Communication, Teamwork, Problem Solving, Time Management',
    competencies: 'Critical Thinking, Analytical Skills, Leadership',
    education: [
      { department: 'B.Tech Computer Science', institutionName: 'XYZ University', qualificationStartYear: '2012', qualificationEndYear: '2016' },
      { department: 'High School', institutionName: 'ABC High School', qualificationStartYear: '2010', qualificationEndYear: '2012' }
    ],
    collegeProject: [
      { collegeProjectName: 'Resume Builder', collegeProjectSkills: 'Angular, Java, HTML, CSS', collegeProjectDescription: 'Developed a dynamic resume builder application that updates in real-time and supports multiple formats.' }
    ]
  };


  getValue(field: any, dummy: any) {
    // If field is empty, show dummy blurred text
    return field && field.trim() ? field : dummy;
  }


}
