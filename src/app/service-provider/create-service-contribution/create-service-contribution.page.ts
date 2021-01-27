import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-service-contribution',
  templateUrl: './create-service-contribution.page.html',
  styleUrls: ['./create-service-contribution.page.scss'],
})
export class CreateServiceContributionPage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  goto() {
    this.router.navigate(["/tourist/home"]);
  }

}
