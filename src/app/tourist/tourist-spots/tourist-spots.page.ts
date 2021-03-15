import { PhotoDisplayComponent } from './../../modules/page-elements-display/photo-display/photo-display.component';
import {TextDisplayComponent} from './../../modules/page-elements-display/text-display/text-display.component';
import {LabelledTextDisplayComponent} from './../../modules/page-elements-display/labelled-text-display/labelled-text-display.component';
// import { ElementComponent } from './../../modules/interfaces/element-component';
import { ActivatedRoute } from '@angular/router';
import { PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';
import { ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { PageCreatorComponent } from 'src/app/modules/page-creator/page-creator.component';
// import { TouristSpotPage } from '../../modules/interfaces/tourist-spot-page';
// import { TouristSpotPage } from './../../modules/elementTools/interfaces/tourist-spot-page';
import { ElementComponent } from './../../modules/elementTools/interfaces/element-component';
import { TouristSpotPage } from './../../modules/elementTools/interfaces/tourist-spot-page';

@Component({
  selector: 'app-tourist-spots',
  templateUrl: './tourist-spots.page.html',
  styleUrls: ['./tourist-spots.page.scss'],
})
export class TouristSpotsPage implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  public pageCreator: PageCreatorComponent;
  public rules:boolean = true;
  touristSpot: TouristSpotPage = {_id: null, components: [],services:[], bookingInfo:[]}
  components = {
    'text': TextDisplayComponent,
    'labelled-text': LabelledTextDisplayComponent,
    'photo': PhotoDisplayComponent,
  }

  constructor(
    public creator: PageCreatorService,
    private route: ActivatedRoute,
    public componentFactoryResolver: ComponentFactoryResolver,
  )
   { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); 
      console.log("id:", id)
      if (id) {
        this.creator.retrieveToristSpotPage(id).subscribe(
          (response: TouristSpotPage) => {
            this.touristSpot = response;
            this.setPage()
          },
          error => {
            console.log("error in getting tourist spot: ", error)
          }
        )
      }
    })
  }
  
  hideAndShow(){
    if(this.rules){
      this.rules = false;
    }else{
      this.rules = true;
    }
  }
  setPage() {
    this.touristSpot.components.forEach((component: any) => {
      console.log(component)
      this.renderComponent(component.type, component)
    })
  }

  // async showComponentList() {
  //   const modal = await this.modalController.create({
  //     component: PageElementListComponent,
  //     cssClass: 'componentListModal'
  //   });
  //   const present = await modal.present();
  //   const { data } = await modal.onWillDismiss();
  //   this.renderComponent(data, null);

  //   return present;
  // }

  renderComponent(componentName: string, componentValues: any) {
    if (componentName) {
      const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentName]);
      const comp = this.pageElement.createComponent<ElementComponent>(factory);
      comp.instance.values = componentValues;
      // comp.instance.parentId = this.touristSpot._id;
    }
  }
}
