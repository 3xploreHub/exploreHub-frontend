import { Component, OnInit } from '@angular/core';
import { ElementValues } from 'src/app/modules/elementTools/interfaces/ElementValues';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  public services: ElementValues[];
  constructor(public mainService: MainServicesService) { }

  ngOnInit() {
    this.services = this.mainService.currentPage ? this.mainService.currentPage.services: null;
  }

  getItemName(item) {
    const name =  item.data.filter(comp => comp.data.defaultName == 'name')
    return name.length > 0 && name[0].data.text? name[0].data.text: 'Untitled';
  }

  filterItem(data) {
    return data.filter(item => item.type == "item")
  }
}
