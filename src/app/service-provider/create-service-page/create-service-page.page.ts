import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicePage } from 'src/app/modules/elementTools/interfaces/service-page';
import { PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';
import { PageCreatorComponent } from 'src/app/modules/page-creator/page-creator.component';

@Component({
  selector: 'app-create-service-page',
  templateUrl: './create-service-page.page.html',
  styleUrls: ['./create-service-page.page.scss'],
})
export class CreateServicePagePage implements OnInit {
  @ViewChild(PageCreatorComponent)
  public pageCreator: PageCreatorComponent;
  public touristSpot: ServicePage;

  constructor(
    public creator: PageCreatorService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); 
      if (id) {
        this.creator.retrievePage(id, "service").subscribe(
          (response: ServicePage) => {
            this.touristSpot = response;
            this.pageCreator.setPage(this.touristSpot, "service")
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
