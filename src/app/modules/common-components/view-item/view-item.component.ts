import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MainServicesService } from 'src/app/service-provider/provider-services/main-services.service';
import { ElementComponent } from '../../elementTools/interfaces/element-component';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';
import { BulletFormTextDisplayComponent } from '../../page-elements-display/bullet-form-text-display/bullet-form-text-display.component';
import { LabelledTextDisplayComponent } from '../../page-elements-display/labelled-text-display/labelled-text-display.component';
import { PhotoDisplayComponent } from '../../page-elements-display/photo-display/photo-display.component';
import { TextDisplayComponent } from '../../page-elements-display/text-display/text-display.component';

@Component({
  selector: 'app-view-item-component',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.scss'],
})
export class ViewItemComponent implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  public values:ElementValues;
  public serviceId: string;
  public itemId: string;
  public pageId: string;
  public pageType: string;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  components = {
    'text': TextDisplayComponent,
    'labelled-text': LabelledTextDisplayComponent,
    'photo': PhotoDisplayComponent,
    'bullet-form-text': BulletFormTextDisplayComponent,
  }

  constructor(
    public modalController: ModalController,
    public componentFactoryResolver: ComponentFactoryResolver,
    public creator: PageCreatorService,
    public route: ActivatedRoute,
    public mainService: MainServicesService
  ) {
    this.values = {
      data: [],
      _id: null,
      styles: [],
      default: false,
      type: null
    }
  }

  ngOnInit() {
    
    // setTimeout(() => {
    //   if (this.values.data.length > 0) {
    //     this.setPage(this.values.data)
    //   }
    // }, 400);
  }

  // setPage(component) {
  //   setTimeout(() => {
  //     component.forEach((component: any) => {
  //       this.renderComponent(component.type, component)
  //     })
  //   }, 500);
  // }

  // renderComponent(componentName: string, componentValues: any) {
  //   if (componentName) {
  //     const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentName]);
  //     const comp = this.pageElement.createComponent<ElementComponent>(factory);
  //     comp.instance.values = componentValues;
  //     comp.instance.parentId = this.values._id;
  //     comp.instance.parent = "component"
  //   }
  // }
}
