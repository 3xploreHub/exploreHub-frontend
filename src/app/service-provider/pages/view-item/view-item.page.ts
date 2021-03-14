import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ElementValues } from 'src/app/modules/elementTools/interfaces/ElementValues';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.page.html',
  styleUrls: ['./view-item.page.scss'],
})
export class ViewItemPage implements OnInit {
  public values:ElementValues;
  public serviceId: string;
  public itemId: string;
  public pageId: string;
  public pageType: string;
  constructor(public route: ActivatedRoute, public mainService: MainServicesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.serviceId = params.get('serviceId'); 
      this.itemId = params.get('itemId'); 
      this.pageId = params.get('pageId');
      this.pageType = params.get("pageType");
      this.mainService.viewItems({pageId: this.pageId, serviceId: this.serviceId, pageType: this.pageType}).subscribe(
        (response: ElementValues) => {
          this.values = response[0].services[0];
          console.log(this.values);
          
        },
        err => {
          
        }
      )
    })
  }

}
