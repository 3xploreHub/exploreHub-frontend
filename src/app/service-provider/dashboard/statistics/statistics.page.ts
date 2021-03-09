import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementValues } from 'src/app/modules/elementTools/interfaces/ElementValues';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  public services: ElementValues[];
  public pageId: string;
  public pageType: string;
  constructor(public mainService: MainServicesService, public router: Router) { }

  ngOnInit() {
    const url = this.router.url.split('/').reverse();
    this.mainService.getServices(url[2], url[3]).subscribe(
      (response: Page) => {
        this.services = response.services;
      },

    )
  }

  getItemName(item) {
    const name = item.data.filter(comp => comp.data.defaultName == 'name')
    return name.length > 0 && name[0].data.text ? name[0].data.text : 'Untitled';
  }

  filterItem(data) {
    return data.filter(item => item.type == "item")
  }
}
