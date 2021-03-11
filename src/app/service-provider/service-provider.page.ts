import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Page } from '../modules/elementTools/interfaces/page';
import { PageCreatorService } from '../modules/page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-service-provider',
  templateUrl: './service-provider.page.html',
  styleUrls: ['./service-provider.page.scss'],
})

export class ServiceProviderPage implements OnInit {
  
  constructor(public router: Router,public creator: PageCreatorService, private menu: MenuController) { }

  ngOnInit() {
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  goto() {
    this.router.navigate(["/service-provider/select-host-tourist-spot"]);
  }

  createTouristSpotPage() {
    const self = this;
    this.creator.createPage("tourist_spot").subscribe( 
      (response: Page) => {
        self.router.navigate(["/service-provider/create-tourist-spot-page", response._id])
      },
      (error) => {
        console.log("error in creating tourist spot: ",error)
      }
    )
  }


}
