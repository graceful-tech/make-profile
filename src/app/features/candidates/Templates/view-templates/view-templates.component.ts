import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/services/api.service';
import { GlobalService } from 'src/app/services/global.service';
import { ChooseTemplateComponent } from '../choose-template/choose-template.component';

@Component({
  selector: 'app-view-templates',
  standalone: false,
  templateUrl: './view-templates.component.html',
  styleUrl: './view-templates.component.css'
})
export class ViewTemplatesComponent {


  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private gs: GlobalService,
    private datePipe: DatePipe,
    private dialog: DialogService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public ref: DynamicDialogRef,
  ) {}

  ngOnInit() {
   
  }

  chooseTemplate(){
   const ref = this.dialog.open(ChooseTemplateComponent, {
        data: { },
        closable: true,
        width: '40%',
        height:'90%',
        styleClass: 'custom-dialog-header',
      });
   
     ref.onClose.subscribe(response => {
      if (response) {
      }
    });
  }

}
