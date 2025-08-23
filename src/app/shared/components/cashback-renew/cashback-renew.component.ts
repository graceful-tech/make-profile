import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cashback-renew',
  standalone: false,
  templateUrl: './cashback-renew.component.html',
  styleUrl: './cashback-renew.component.css'
})
export class CashbackRenewComponent {


   constructor(
      
      private router: Router,
       
    ) {}

  home(){
        history.back();
  }

  

}
