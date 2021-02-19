import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhotoComponent } from 'src/app/modules/page-elements/photo/photo.component';
import { TextComponent } from 'src/app/modules/page-elements/text/text.component';
import { ElementComponent } from '../interfaces/element-component';
import { ElementValues } from '../interfaces/ElementValues';
import { TouristSpotPage } from '../interfaces/tourist-spot-page';
import { PageElementListComponent } from '../page-element-list/page-element-list.component';
import { LabelledTextComponent } from '../page-elements/labelled-text/labelled-text.component';
import { PageServicesListComponent } from '../page-services-list/page-services-list.component';
import { ItemListComponent } from '../page-services/item-list/item-list.component';
import { ItemComponent } from '../page-services/item/item.component';
import { PageCreatorService } from './page-creator-service/page-creator.service';

@Component({
  selector: 'app-page-creator',
  templateUrl: './page-creator.component.html',
  styleUrls: ['./page-creator.component.scss'],
})

export class PageCreatorComponent implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  @ViewChild('pageService', { read: ViewContainerRef }) pageService: ViewContainerRef;
  public page: TouristSpotPage;
  components = {
    'text': TextComponent,
    'labelled-text': LabelledTextComponent,
    'photo': PhotoComponent,
    'item-list': ItemListComponent
  }

  constructor(public modalController: ModalController,
    public componentFactoryResolver: ComponentFactoryResolver,
    public creator: PageCreatorService
  ) { }

  ngOnInit() {
  }

  setPage(page) {
    this.page = page;
    this.creator.currentPageId = this.page._id;
    this.page.components.forEach((component: any) => {
      this.renderComponent(this.pageElement, component.type, component)
    })
    this.page.services.forEach((component: any) => {
      this.renderComponent(this.pageService, component.type, component)
    })
  }

  async showComponentList() {
    return this.showModal(this.pageElement, PageElementListComponent);
  }

  showServicesComponentList() {
    return this.showModal(this.pageService, PageServicesListComponent);
  }

  async showModal(type: ViewContainerRef, List: any) {
    const modal = await this.modalController.create({
      component: List,
      cssClass: 'componentListModal'
    });
    const present = await modal.present();
    const { data } = await modal.onWillDismiss();
    this.renderComponent(type, data, null);

    return present;
  }

  renderComponent(type: ViewContainerRef, componentName: string, componentValues: any) {
    if (componentName) {
      const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentName]);
      const comp = type.createComponent<ElementComponent>(factory);
      comp.instance.values = componentValues;
      comp.instance.parentId = this.page._id;
      comp.instance.parent = "page";
    }
  }

}
