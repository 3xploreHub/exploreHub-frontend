import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-online-pages-list',
  templateUrl: './online-pages-list.page.html',
  styleUrls: ['./online-pages-list.page.scss'],
})
export class OnlinePagesListPage implements OnInit, ViewWillEnter {
  public pages: Page[];
  notificationsCount = 0 
  constructor(public router: Router, public mainService: MainServicesService) { }

  ngOnInit() {
    this.mainService.getOnlinePages().subscribe(
      (response: Page[]) => {
        this.pages = response;
      }
    )
    this.getNotificationCount()
    this.mainService.notification.subscribe(
      (data: any) => {
        if (!data.receiver.includes("all")) {
          this.getNotificationCount()
        }
      }
    )
    // this.mainService.notification.subscribe((data:any) => {
    //   if (data.type == "page-status-edit") {
    //     this.pages = this.pages.map(page => {
    //       if (page._id == data.pageId) {
    //         page.status = data.status
    //         if (data.status == "Online") return page
    //       } else  {
    //         return page
    //       }
    //     })
    //     this.pages = this.pages.filter(page => page)
    //   }
    // })
  }
  ionViewWillEnter() {

    this.getNotificationCount()
  }

  getNotificationCount() {
    this.mainService.getNotificationsCount().subscribe(
      (response: any) => {
        this.notificationsCount = response
      }
    )
  }

  viewPage(page) {
    this.router.navigate(['/service-provider/view-page', page.pageId, page.pageType])
  }
}
