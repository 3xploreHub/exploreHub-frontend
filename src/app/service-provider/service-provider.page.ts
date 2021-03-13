import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TouristSpotPage } from '../modules/elementTools/interfaces/tourist-spot-page';
import { PageCreatorService } from '../modules/page-creator/page-creator-service/page-creator.service';
import { AuthService } from './../Services/auth-services/auth-service.service';

@Component({
  selector: 'app-service-provider',
  templateUrl: './service-provider.page.html',
  styleUrls: ['./service-provider.page.scss'],
})
export class ServiceProviderPage implements OnInit {
  
  constructor(public router: Router,public creator: PageCreatorService, private authService: AuthService) { }

  ngOnInit() {
  }

  goto() {
    this.router.navigate(["/service-provider/select-host-tourist-spot"]);
  }

  createTouristSpotPage() {
    const self = this;
    this.creator.createTouristSpotPage().subscribe( 
      (response: TouristSpotPage) => {
        self.router.navigate(["/service-provider/create-tourist-spot-page", response._id])
      },
      (error) => {
        console.log("error in creating tourist spot: ",error)
      }
    )
  }

  logout() {
    this.authService.logOut();
    this.router.navigate(["/login"]);
  }

}
