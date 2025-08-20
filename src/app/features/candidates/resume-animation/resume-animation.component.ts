import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-resume-animation',
  standalone: false,
  templateUrl: './resume-animation.component.html',
  styleUrl: './resume-animation.component.css',
    
})
export class ResumeAnimationComponent {

candidate: any = {
    name: '',
    phone: '',
    email: '',
    linkedin: '',
    objective: '',
    summary: '',
    experiences: [],
    skills: '',
    softSkills: '',
    competencies: '',
    education: [],
    collegeProject: []
  };

  dummyCandidate: any = {
    name: 'John Doe',
    phone: '+91 1234567890',
    email: 'john.doe@example.com',
    linkedin: 'linkedin.com/in/johndoe',
    objective: 'To work in a challenging environment.',
    summary: 'Experienced professional in software development.',
    experiences: [
      {
        role: 'Software Engineer',
        companyName: 'ABC Corp',
        experienceYearStartDate: '2018-01-01',
        experienceYearEndDate: '2022-12-31',
        responsibilities: 'Developed applications, wrote tests, collaborated with teams'
      }
    ],
    skills: 'Angular, Java, SQL',
    softSkills: 'Communication, Teamwork',
    competencies: 'Problem Solving, Critical Thinking',
    education: [
      { department: 'B.Tech Computer Science', institutionName: 'XYZ University', qualificationStartYear: '2014', qualificationEndYear: '2018' }
    ],
    collegeProject: [
      { collegeProjectName: 'Resume Builder', collegeProjectSkills: 'Angular, Java', collegeProjectDescription: 'Developed a dynamic resume builder app.' }
    ]
  };


onSubmit() {
throw new Error('Method not implemented.');
}
 

     
}