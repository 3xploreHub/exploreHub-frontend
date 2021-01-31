import { Component, OnInit, ViewChild } from '@angular/core';
import { TouristSpotPage } from 'src/app/modules/interfaces/tourist-spot-page';
import { PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';
import { PageCreatorComponent } from 'src/app/modules/page-creator/page-creator.component';

@Component({
  selector: 'app-create-tourist-spot-page',
  templateUrl: './create-tourist-spot-page.page.html',
  styleUrls: ['./create-tourist-spot-page.page.scss'],
})
export class CreateTouristSpotPagePage implements OnInit {
  @ViewChild(PageCreatorComponent)
  public pageCreator:PageCreatorComponent;
  public touristSpot: TouristSpotPage;

  constructor(
    public creator: PageCreatorService
  ) { }

  ngOnInit() {
    this.creator.get("touristSpotId").then(id => {
      this.creator.getDraftTouristSpotPage(id).subscribe(
        response => {
          this.touristSpot = response;
          this.pageCreator.setPage(this.touristSpot)
        },
        error => {
          console.log("error in getting tourist spot: ", error)
        }
      )
    })
  }

}
