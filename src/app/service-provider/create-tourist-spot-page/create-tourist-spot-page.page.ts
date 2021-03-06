import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TouristSpotPage } from 'src/app/modules/elementTools/interfaces/tourist-spot-page';
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
  public touristSpot: TouristSpotPage;

  constructor(
    public creator: PageCreatorService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); 
      if (id) {
        this.creator.retrieveToristSpotPage(id).subscribe(
          (response: TouristSpotPage) => {
            this.touristSpot = response;
            this.pageCreator.setPage(this.touristSpot)  
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
