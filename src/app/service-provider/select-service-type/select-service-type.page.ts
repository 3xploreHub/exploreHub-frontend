import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-service-type',
  templateUrl: './select-service-type.page.html',
  styleUrls: ['./select-service-type.page.scss'],
})
export class SelectServiceTypePage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  goto() {
    this.router.navigate(["/service-provider/create-service-contribution"]);
  }

}
