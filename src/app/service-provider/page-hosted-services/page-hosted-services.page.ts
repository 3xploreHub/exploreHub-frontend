import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-page-hosted-services',
  templateUrl: './page-hosted-services.page.html',
  styleUrls: ['./page-hosted-services.page.scss'],
})
export class PageHostedServicesPage implements OnInit {
  public pageId: string;
  public hostedPages: Page[] = []
  constructor(public route: ActivatedRoute, 
    public router: Router, public mainService: MainServicesService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params && params.pageId) {
          this.pageId = params.pageId;
          if (this.mainService.user._id != params.creator) {
            this.router.navigate(["/service-provider/online-pages-list"])
          } else {
            this.mainService.getHostedPages(this.pageId).subscribe(
              (data: any) => {
                this.hostedPages = data
              }
            )
          }
        }
      })
  }

}
