import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page, PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';
import { PageCreatorComponent } from 'src/app/modules/page-creator/page-creator.component';

@Component({
  selector: 'app-create-tourist-spot-page',
  templateUrl: './create-tourist-spot-page.page.html',
  styleUrls: ['./create-tourist-spot-page.page.scss'],
})
export class CreateTouristSpotPagePage implements OnInit {
  @ViewChild(PageCreatorComponent)
  public pageCreator: PageCreatorComponent;
  public touristSpot: Page;

  constructor(
    public creator: PageCreatorService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); 
      console.log("id:", id)
      if (id) {
        this.creator.retrieveToristSpotPage(id).subscribe(
          (response: Page) => {
            this.touristSpot = response;
            this.pageCreator.setPage(this.touristSpot)
          },
          error => {
            console.log("error in getting tourist spot: ", error)
          }
        )
      }
    })
  }

}
