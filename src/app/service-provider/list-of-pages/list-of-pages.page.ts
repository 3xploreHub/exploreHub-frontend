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
  public pagesStatus: string;
  constructor(
    public router: Router,
    public mainService: MainServicesService,
    public route: ActivatedRoute,
    public alert: AlertController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.pagesStatus = params.get('status');
      this.mainService.getPages(this.pagesStatus).subscribe(
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
    const pageTypge = page.hostTouristSpot == 'service'? "create-service-page": "create-tourist-spot-page";
    setTimeout(() => {
      if (page.status != "Unfinished") {
        this.router.navigate(["/service-provider/dashboard", type, page._id])
      } else {
        this.router.navigate([`/service-provider/${pageTypge}`, page._id])
      }
    }, 200);
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
