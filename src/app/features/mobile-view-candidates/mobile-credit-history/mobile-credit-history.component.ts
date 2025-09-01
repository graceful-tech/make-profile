import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-credit-history',
  standalone: false,
  templateUrl: './mobile-credit-history.component.html',
  styleUrl: './mobile-credit-history.component.css'
})
export class MobileCreditHistoryComponent {
constructor(private router:Router){

}

goBack(){
  this.router.navigate(['mob-candidate'])
}
}
