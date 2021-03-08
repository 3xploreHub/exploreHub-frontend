import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-list-of-pages',
  templateUrl: './list-of-pages.page.html',
  styleUrls: ['./list-of-pages.page.scss'],
})
export class ListOfPagesPage implements OnInit {
  public pages: Page[];
  constructor(
    public router: Router,
    public mainService: MainServicesService,
    public route: ActivatedRoute,
    public alert: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const status = params.get('status');
      this.mainService.getPages(status).subscribe(
        (response: Page[]) => {
          this.pages = response;
        },
        error => {
          this.presentAlert("Unexpected Error Occured!")
          this.router.navigate(['service-provider'])
        }
      )
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

  goToDashBoard(page) {
    const type = page.hostTouristSpot ? "service" : "tourist_spot"
    this.router.navigate(["/service-provider/dashboard", type, page._id])
  }

  getStatus(page) {
    const status = page.status;
    return {
      'onlineBg': status == 'Online',
      'pendingBg': status == 'Pending',
      'rejectedBg': status == 'Rejected' || status == 'Unfinished'
    }
  }

}
