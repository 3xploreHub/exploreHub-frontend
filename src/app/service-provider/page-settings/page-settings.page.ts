import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-page-settings',
  templateUrl: './page-settings.page.html',
  styleUrls: ['./page-settings.page.scss'],
})
export class PageSettingsPage implements OnInit {
  public pageId: string;
  public page: Page;
  constructor(public route: ActivatedRoute, public mainService: MainServicesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params: any) => {
        this.pageId = params.get("pageId")
        this.mainService.getPage(this.pageId).subscribe(
          (page: Page) => {
            this.page = page
          }
        )
      }
    )
  }

}
