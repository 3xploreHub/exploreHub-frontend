import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-account-info',
  templateUrl: './edit-account-info.page.html',
  styleUrls: ['./edit-account-info.page.scss'],
})
export class EditAccountInfoPage implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['/tourist/settings']);
  }

}
