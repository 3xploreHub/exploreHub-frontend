import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-provider',
  templateUrl: './service-provider.page.html',
  styleUrls: ['./service-provider.page.scss'],
})
export class ServiceProviderPage implements OnInit {
  
  constructor(public router: Router) { }

  ngOnInit() {
  }

  goto() {
    this.router.navigate(["/service-provider/select-host-tourist-spot"]);
  }


}
