import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhotoComponent } from 'src/app/modules/page-elements/photo/photo.component';
import { PhotosSlidesComponent } from 'src/app/modules/page-elements/photos-slides/photos-slides.component';
import { TextComponent } from 'src/app/modules/page-elements/text/text.component';
import { ElementComponent } from '../interfaces/element-component';
import { ElementValues } from '../interfaces/ElementValues';
import { TouristSpotPage } from '../interfaces/tourist-spot-page';
import { PageElementListComponent } from '../page-element-list/page-element-list.component';
import { LabelledTextComponent } from '../page-elements/labelled-text/labelled-text.component';
import { TitleComponent } from '../page-elements/title/title.component';
import { PageCreatorService } from './page-creator-service/page-creator.service';

@Component({
  selector: 'app-page-creator',
  templateUrl: './page-creator.component.html',
  styleUrls: ['./page-creator.component.scss'],
})

export class PageCreatorComponent implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  public page: TouristSpotPage;
  components = {
    'text': TextComponent,
    'labelled-text': LabelledTextComponent,
    'title': TitleComponent,
    'photo': PhotoComponent,
    'photos-slide': PhotosSlidesComponent
  }

  constructor(public modalController: ModalController,
    public componentFactoryResolver: ComponentFactoryResolver,
    public creator: PageCreatorService
  ) { }

  ngOnInit() {
    //dfgdf
  }

  setPage(page) {
    this.page = page;
    this.page.components.forEach((component: any) => {
      console.log(component)
      this.renderComponent(component.type, component)
    })
  }

  async showComponentList() {
    const modal = await this.modalController.create({
      component: PageElementListComponent,
      cssClass: 'componentListModal'
    });
    const present = await modal.present();
    const { data } = await modal.onWillDismiss();
    this.renderComponent(data, null);

    return present;
  }

  renderComponent(componentName: string, componentValues: any) {
    if (componentName) {
      const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentName]);
      const comp = this.pageElement.createComponent<ElementComponent>(factory);
      comp.instance.values = componentValues;
      comp.instance.parentId = this.page._id;
    }
  }
}
