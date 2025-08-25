import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

@Component({
  selector: 'app-resume-editor',
  standalone: false,
  templateUrl: './resume-editor.component.html',
  styleUrl: './resume-editor.component.css'
})
export class ResumeEditorComponent {

  html:any
  sections: { id: string; html: string }[] = [];

  // sections = [
  //   { id: 'objective', html: '<h2 class="section-title">OBJECTIVE</h2><p>...</p>' },
  //   { id: 'summary', html: '<h2 class="section-title">SUMMARY</h2><p>...</p>' },
  //   { id: 'experience', html: '<h2 class="section-title">PROFESSIONAL EXPERIENCE</h2><p>...</p>' },
  //   { id: 'education', html: '<h2 class="section-title">EDUCATION</h2><p>...</p>' },
  //   { id: 'skills', html: '<h2 class="section-title">TECHNICAL SKILLS</h2><p>...</p>' }
  // ];


  

 ngOnInit() {
    // this.resumeService.getResumeTemplate().subscribe(html => {
    //   const container = document.createElement('div');
    //   container.innerHTML = html;

    //   this.sections = Array.from(container.querySelectorAll('.section')).map(sec => ({
    //     id: sec.getAttribute('id') || '',
    //     html: sec.outerHTML
    //   }));
    // });


    this.html =`
						 		 <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>


    @page {
      size: A4;
	  margin: 30px 30px;
	  width: 100%;
	}



    html, body {
      margin: 0;
      padding: 0;
      width: 210mm;
      font-family: Arial, sans-serif;
      font-size: 11pt;
      color: #111;
    }

    .container {
      width: 200mm;
      padding: 10mm;
      margin: auto;
      background: white;
      box-sizing: border-box;
      position: relative;
    }

    .profile-pic {
      position: absolute;
      top: 9mm;
      right: 10mm;
      width: 30mm;
      height: 30mm;
      object-fit: cover;
      border-radius: 50%;
      border: 2px solid #0054a6;
    }

    p{
	  line-height:1.2;
	}

    h1 {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 0;
    }

    .blue {
      color: #0054a6;
      font-weight: bold;
    }

    .contact {
      font-size: 14px;
      margin-bottom: 20px;
    }

    h2 {
      font-size: 18px;
      border-bottom: 2px solid #222;
    }

    .section {
      margin-top: 18px;
     }

    .section-title {
      font-weight: bold;
      font-size: 18px;
      border-bottom: 2px solid #000;
      color: #0054a6;
    }

    .job-title {
      font-weight: bold;
    }

    .location-date {
      font-size: 14px;
      color: #555;
      margin-top: 10px;
    }

    .bullets {
      padding-left: 20px;
    }

    .bullets li {
      line-height:1.3;
    }

    .tags {
      margin-top: 10px;
    }

    .tag {
      display: inline-block;
      background-color: #eee;
      border-radius: 4px;
      padding: 4px 8px;
      margin: 4px 4px 0 0;
      font-size: 13px;
    }

    .skills-section {
    width: 100%;
  }

  .skill-item {
    display: table;
    width: 100%;
    margin-top: 6px;
  }

  .skill-name {
    display: table-cell;
    width: 40%;
    font-weight: bold;
    padding-right: 8px;
    vertical-align: middle;
  }

  .skill-dots {
    display: table-cell;
    width: 60%;
    vertical-align: middle;
  }

  .dot {
    display: inline-block;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: #ccc;
    margin-right: 4px;
  }

  .dot.filled {
    background-color: #0054a6;
  }

    .timeline {
      position: relative;
      margin-top: 13px;
      padding-left: 20px;
      border-left: 3px dotted #0054a6;
    }

    .timeline-item {
      position: relative;
      padding-left: 20px;
    }

    .timeline-item::before {
      content: '';
      position: absolute;
      left: -11px;
      top: 5px;
      width: 14px;
      height: 14px;
      background-color: #0054a6;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 0 4px #0054a6;
    }

    .timeline-date {
      font-weight: bold;
      color: #0054a6;
    }

    .timeline-content .job-title {
      font-weight: bold;
      font-size: 16px;
    }

    .timeline-content .company {
      font-size: 14px;
      margin-bottom: 8px;
    }

     ul{
     line-height: 1.5;
     margin-bottom: 5px;
     }


  </style>
</head>
<body>


 <div class="container">

 
      <h1>SANTHOSH S</h1>

   <div class="contact">



	       Phone: 6374744829

	          | Email: santhoshsivan2508@gmail.com

   </div>

		<div class="section" id="OBJECTIVE">
		    <div class="section-title">OBJECTIVE</div>
		    <p>Aspire to leverage my software testing expertise and strong problem-solving skills in a challenging environment, aiming to enhance product quality and customer satisfaction while advancing my professional development within a reputable organization.</p>
		</div>

	  <div class="section" id="SUMMARY">
	    <div class="section-title">SUMMARY</div>
	     <p>Dynamic and detail-oriented Software Engineer with experience in manual and automated testing of software applications. Committed to ensuring high-quality deliverables through comprehensive testing strategies and methodologies. Proficient in collaborating with cross-functional teams to enhance software performance while contributing to overall project success.</p>
 	  </div>



  <div class="section" id="EXPERIENCE">
    <div class="section-title">PROFESSIONAL EXPERIENCE</div>
    <div class="timeline">

        <div class="timeline-item">
          <div class="timeline-date">
              2023
                         - 2025
          </div>

          <div class="timeline-content">
              <div class="job-title">Software Engineer</div>

              <div class="company">Combat Vehicles Research and Development Establishment (CVRDE), DRDO</div>

              <ul class="bullets">
                    <li>Performed manual testing to validate application functionality</li>
                    <li>performance</li>
                    <li>and reliability. Designed and executed test cases</li>
                    <li>test plans</li>
                    <li>and test scripts based on business and technical requirements. Conducted smoke</li>
                    <li>functional</li>
                    <li>regression</li>
                    <li>integration</li>
                    <li>and user acceptance testing (UAT). Reported and tracked defects using JIRA while coordinating closely with the development team. Wrote SQL queries to verify data integrity and validate backend processes. Developed and refined user interfaces (UI) for internal applications to improve usability. Maintained and updated test documentation in line with changing project requirements.</li>
              </ul>
          </div>
        </div>

    </div>
  </div>



	<div class="section" id="education">
		    <div class="section-title">EDUCATION</div>
 				    <ul class="bullets">
						 <li>
							      <strong>
							         Computer Science and Engineering
							       </strong>
	  						        – Pavai College of Technology
			                                  ( 2018
                                                    - 2022 )

 						   </li>
						   <li>
							      <strong>
							         Computer Science and Engineering
							       </strong>
	  						        – Pavai College of Technology
			                                  ( 2018
                                                    - 2022 )

 						   </li>
						   <li>
							      <strong>
							         Computer Science and Engineering
							       </strong>
	  						        – Pavai College of Technology
			                                  ( 2018
                                                    - 2022 )

 						   </li>
				    </ul>

		  </div>


	  <div class="section" id="skills">
	    <div class="section-title">TECHNICAL SKILLS</div>
	    <div class="skills-section">
	          <div class="skill-item">
	            <div class="skill-name">Core Java</div>
	            <div class="skill-dots">


	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot"></span>
	            </div>
	          </div>
	          <div class="skill-item">
	            <div class="skill-name">Manual Testing</div>
	            <div class="skill-dots">


	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot"></span>
	            </div>
	          </div>
	          <div class="skill-item">
	            <div class="skill-name">Functional Testing</div>
	            <div class="skill-dots">


	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot"></span>
	                <span class="dot"></span>
	                <span class="dot"></span>
	            </div>
	          </div>
	          <div class="skill-item">
	            <div class="skill-name">Regression Testing</div>
	            <div class="skill-dots">


	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot"></span>
	                <span class="dot"></span>
	                <span class="dot"></span>
	            </div>
	          </div>
	          <div class="skill-item">
	            <div class="skill-name">Smoke Testing</div>
	            <div class="skill-dots">


	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot"></span>
	                <span class="dot"></span>
	            </div>
	          </div>
	          <div class="skill-item">
	            <div class="skill-name">Integration Testing</div>
	            <div class="skill-dots">


	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot"></span>
	                <span class="dot"></span>
	            </div>
	          </div>
	          <div class="skill-item">
	            <div class="skill-name">User Acceptance Testing (UAT)</div>
	            <div class="skill-dots">


	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot"></span>
	                <span class="dot"></span>
	            </div>
	          </div>
	          <div class="skill-item">
	            <div class="skill-name">Selenium WebDriver</div>
	            <div class="skill-dots">


	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot"></span>
	                <span class="dot"></span>
	            </div>
	          </div>
	          <div class="skill-item">
	            <div class="skill-name">TestNG</div>
	            <div class="skill-dots">


	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot"></span>
	                <span class="dot"></span>
	            </div>
	          </div>
	          <div class="skill-item">
	            <div class="skill-name">Cucumber</div>
	            <div class="skill-dots">


	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot"></span>
	                <span class="dot"></span>
	            </div>
	          </div>
	          <div class="skill-item">
	            <div class="skill-name">MySQL</div>
	            <div class="skill-dots">


	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot filled"></span>
	                <span class="dot"></span>
	                <span class="dot"></span>
	            </div>
	          </div>
	    </div>
	  </div>







</div>



</body>
</html>


`

   const container = document.createElement('div');
      container.innerHTML = this.html;

      const styleTag = container.querySelector('style');
    if (styleTag) {
       const oldStyle = document.getElementById('ftl-style');
      if (oldStyle) oldStyle.remove();

      const newStyle = document.createElement('style');
      newStyle.id = 'ftl-style';
      newStyle.innerHTML = styleTag.innerHTML;
      document.head.appendChild(newStyle);
    }

     this.sections = Array.from(container.querySelectorAll('.section')).map(sec => ({
      id: sec.getAttribute('id') || '',
      html: sec.outerHTML
    }));

  }

 drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
  }

 saveOrder() {
   const finalSections = this.sections.map(s => s.html).join('');

   const styleTag = document.getElementById('ftl-style');
  const css = styleTag ? styleTag.innerHTML : '';

   const finalHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        ${css}
      </style>
    </head>
    <body>
      <div class="container">
        ${finalSections}
      </div>
    </body>
    </html>
  `;

  console.log(finalHtml);
 
}

 

 }

