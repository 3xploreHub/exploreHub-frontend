import { Component, OnInit } from '@angular/core';
import { PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';

@Component({
  selector: 'app-select-tourist-spot-category',
  templateUrl: './select-tourist-spot-category.page.html',
  styleUrls: ['./select-tourist-spot-category.page.scss'],
})
export class SelectTouristSpotCategoryPage implements OnInit {

  constructor(public creator: PageCreatorService) { }

  ngOnInit() {
    this.creator.save("touristSpotId", "fake-tourist-spot-id")
  }

}
