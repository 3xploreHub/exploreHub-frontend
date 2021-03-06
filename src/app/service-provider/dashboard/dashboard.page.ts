import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  public page: Page;
  clickedTab: string = 'Booked'
  boxPosition: number;

  constructor(public router: Router,
    public mainService: MainServicesService,
    public alert: AlertController,
    private route: ActivatedRoute,
  ) {
    this.page = { _id: '', components: [], services: [], bookingInfo: [], status: '', creator: "", hostTouristSpot: '' }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const pageId = params.get('pageId');
      const pageType = params.get('pageType');
      if (pageId && pageType) {
        this.mainService.getPage(pageId, pageType).subscribe(
          (response: Page) => {
            this.page = response;
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
        this.router.navigate(["/service-provider/list-of-pages"])
      }
    })
  }

  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  goBack() {
    setTimeout(() => {
      this.router.navigate(["service-provider/list-of-pages"])
    }, 200);
  }

  goToSection(tab: string, div: HTMLElement) {
    this.clickedTab = tab;
    const width = div.clientWidth;
    switch (tab) {
      case 'Booked':
        this.boxPosition = 0;
        break;
      case 'Pending':
        this.boxPosition = width;
        break;
      default:
        this.boxPosition = width * 2
        break;
    }
  }
}
