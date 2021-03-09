import { Component, OnInit, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ElementValues } from 'src/app/modules/elementTools/interfaces/ElementValues';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { LabelledTextDisplayComponent } from 'src/app/modules/page-elements-display/labelled-text-display/labelled-text-display.component';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  @ViewChildren(LabelledTextDisplayComponent)
  public numberFormatter: LabelledTextDisplayComponent;
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

  getValue(data, type) {
    const quantity = data.filter(comp => comp.data.defaultName == type);
    console.log(this.numberFormatter);
    
    return quantity.length > 0? this.numberFormatter.formatNumber(quantity[0].data.text): type == 'price'? 'none': 'Unli.'
  }
}
