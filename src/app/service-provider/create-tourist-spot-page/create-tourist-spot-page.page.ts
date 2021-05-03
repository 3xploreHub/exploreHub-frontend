import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';
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
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); 
      if (id) {
        this.creator.retrievePage(id, "tourist_spot").subscribe(
          (response: Page) => {
            this.touristSpot = response;
            this.pageCreator.setPage(this.touristSpot, "tourist_spot")  
          },
          error => {
            this.creator.canLeave = true;
            if (error.status == 404) {
              this.router.navigate(["/service-provider"])
            }
          }
        )
      }
    })
  }

}
