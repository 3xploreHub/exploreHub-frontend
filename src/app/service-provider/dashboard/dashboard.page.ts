import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ComponentsModulePageModule } from 'src/app/components-module/components-module.module';
import { ElementValues } from 'src/app/modules/elementTools/interfaces/ElementValues';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  public page: Page;
  public clickedTab: string = 'Booked'
  public boxPosition: number;
  public pageType: string;
  public name: string;
  public notificationsCount: number;
  public fromNotification: boolean = false;

  constructor(
    public router: Router,
    public mainService: MainServicesService,
    public alert: AlertController,
    private route: ActivatedRoute,
  ) {
    this.page = { _id: '', pageType: "", initialStatus: "", otherServices: [], components: [], services: [], bookingInfo: [], status: '', creator: "", hostTouristSpot: '', createdAt: "" }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.fromNotification) {
        this.fromNotification = true;
      }
    });
    this.route.paramMap.subscribe(params => {
      this.mainService.currentPage = null
      const pageId = params.get('pageId');
      this.pageType = params.get('pageType');
      if (pageId && this.pageType) {
        this.mainService.getPage(pageId).subscribe(
          (response: Page) => {
            this.page = response;
            this.mainService.currentPage = this.page;
            this.getName();
          },
          error => {
            if (error.status == 404) {
              this.presentAlert("Page not found");
              this.router.navigate(['service-provider'])
            }
            else {
              this.presentAlert("Unexpected Error Occured!")
            }
          }
        )
      } else {
        this.router.navigate(["/service-provider/list-of-pages", "submitted"])
      }
      this.getNotifications()
      this.mainService.notification.subscribe(
        (data: any) => {
          if (!data.receiver.includes("all)")) {
            if (data.type == "page-provider" && data.pageId == this.page._id) {
              if (data.initialStatus) this.page.initialStatus = data.initialStatus
              if (data.status) this.page.status = data.status
            }
            this.getNotifications()
          }
        }
      )
    })
  }

  getNotifications() {
    this.mainService.getNotificationsCount().subscribe(
      (response: any) => {
        this.notificationsCount = response
      }
    )
  }

  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  viewPage(e) {
    setTimeout(() => {
      this.router.navigate(["/service-provider/view-page", this.page._id, this.page.pageType])
    }, 300);
  }

  goBack() {
    setTimeout(() => {
      if (this.fromNotification) {
        this.router.navigate(["service-provider/notifications"])
      } else {
        this.router.navigate(["service-provider/list-of-pages/", "submitted"])
      }
    }, 200);
  }

  goTo(path, queryParams = {}) {
    setTimeout(() => {
      this.router.navigate(path, queryParams)
    }, 200);
  }
  editPage() {
    setTimeout(() => {
      const type = this.pageType == 'service' ? "create-service-page" : "create-tourist-spot-page";
      this.router.navigate([`/service-provider/${type}`, this.page._id])
    }, 200);
  }

  viewStats() {
    setTimeout(() => {
      this.router.navigate(["/service-provider/dashboard/" + this.page.pageType + "/" + this.page._id + "/board/statistics"])
    }, 200);
  }

  getStatus() {
    const status = this.page.status;
    return {
      'onlineBg': status == 'Online',
      'pendingBg': status == 'Pending',
      'unfinishedBg': status == 'Unfinished',
      'notOperatingBg': status == "Not Operating",
      'processingBg': status == 'Processing',
      'rejectedBg': status == 'Rejected' || status == 'Cancelled'
    }
  }

  getName() {
    const data = this.page.components[1];
    this.name = data.data.text ? data.data.text : "Untitled"
  }
}

