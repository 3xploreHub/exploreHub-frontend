import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-online-pages-list',
  templateUrl: './online-pages-list.page.html',
  styleUrls: ['./online-pages-list.page.scss'],
})
export class OnlinePagesListPage implements OnInit, ViewWillEnter {
  public pages: Page[] = []
  notificationsCount = 0
  public category: string = "all"
  public loading: boolean = true
  public categories = []
  constructor(public router: Router, public route: ActivatedRoute, public mainService: MainServicesService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.category = params && params.category ? params.category : "all"
      this.mainService.getOnlinePages(this.category).subscribe(
        (response: Page[]) => {
          this.pages = response;
          this.loading = false
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
    })
  }
  
  ionViewWillEnter() {
    this.getAllCategories()
    this.getNotificationCount()
  }

  getNotificationCount() {
    this.mainService.getNotificationsCount().subscribe(
      (response: any) => {
        this.notificationsCount = response
      }
    )
  }

  getAllCategories() {
    this.mainService.getAllCategories().subscribe(
      (response: any) => {
        this.categories = response.categories
      }
    )
  }

  viewPage(page) {
    this.router.navigate(['/service-provider/view-page', page.pageId, page.pageType])
  }

  onChangeCategory(data) {
    console.log(data)
    this.pages = data.pages
  }

}
