import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewPageComponent } from 'src/app/modules/common-components/view-page/view-page.component';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.page.html',
  styleUrls: ['./view-page.page.scss'],
})
export class ViewPagePage implements OnInit {
  @ViewChild(ViewPageComponent)
  public pageView: ViewPageComponent;
  public page: Page;
  
  constructor(public route: ActivatedRoute, public router: Router, public mainService: MainServicesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const pageId = params.get('pageId'); 
        this.mainService.viewPage(pageId).subscribe(
          (response: Page) => {
            this.page = response;
            this.pageView.setPage(this.page, "tourist_spot")
          }
        )
    })
  }

  onScroll(event, info: HTMLElement, services: HTMLElement, div: HTMLElement) {
    // this.pageView.onScroll(event, info, services, div)
  }

  viewItem(data) {
    this.router.navigate(["/service-provider/view-item", data.serviceId, data.itemId])
  }

}
