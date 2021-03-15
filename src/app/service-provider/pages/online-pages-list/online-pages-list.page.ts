import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-online-pages-list',
  templateUrl: './online-pages-list.page.html',
  styleUrls: ['./online-pages-list.page.scss'],
})
export class OnlinePagesListPage implements OnInit {
  public pages: Page[];
  constructor(public router: Router, public mainService: MainServicesService) { }

  ngOnInit() {
    this.mainService.getOnlinePages().subscribe(
      (response: Page[]) => {
        this.pages = response;
      }
    )
  }

  viewPage(page) {
    this.router.navigate(['/service-provider/view-page', page.pageId, page.pageType])
  }
}
