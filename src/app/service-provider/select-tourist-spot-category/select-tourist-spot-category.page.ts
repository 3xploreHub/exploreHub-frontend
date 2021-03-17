import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';
import { TouristPage } from 'src/app/tourist/tourist.page';

@Component({
  selector: 'app-select-tourist-spot-category',
  templateUrl: './select-tourist-spot-category.page.html',
  styleUrls: ['./select-tourist-spot-category.page.scss'],
})
export class SelectTouristSpotCategoryPage implements OnInit {

  constructor(public creator: PageCreatorService, public router: Router) { }

  ngOnInit() {
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
