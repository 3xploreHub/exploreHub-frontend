import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-select-page-type',
  templateUrl: './select-page-type.page.html',
  styleUrls: ['./select-page-type.page.scss'],
})
export class SelectPageTypePage implements OnInit {

  constructor(public router: Router, public creator: PageCreatorService) { }

  ngOnInit() {
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
      }
    )
  }
}
