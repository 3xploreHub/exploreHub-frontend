import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-all-services',
  templateUrl: './all-services.page.html',
  styleUrls: ['./all-services.page.scss'],
})
export class AllServicesPage implements OnInit {
  public services: Page[] = []
  constructor(public route: ActivatedRoute, public mainService: MainServicesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('hostId');
      this.mainService.viewAllServices(id).subscribe(
        (response: Page[]) => {
          this.services = response;
        }
      )
    })
  }

}
