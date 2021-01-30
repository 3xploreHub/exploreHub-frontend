import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhotoComponent } from 'src/app/page-elements/photo/photo.component';
import { PhotosSlidesComponent } from 'src/app/page-elements/photos-slides/photos-slides.component';
import { TextComponent } from 'src/app/page-elements/text/text.component';
import { TitleComponent } from 'src/app/page-elements/title/title.component';
import { PageElementListComponent } from '../page-element-list/page-element-list.component';

@Component({
  selector: 'app-page-creator',
  templateUrl: './page-creator.component.html',
  styleUrls: ['./page-creator.component.scss'],
})
export class PageCreatorComponent implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  components = {
    'text': TextComponent,
    'title': TitleComponent,
    'photo': PhotoComponent,
    'photos-slide': PhotosSlidesComponent
  }

  constructor(public modalController: ModalController,
    private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {

  }
  ngAfterViewInit() {
    console.log(this.pageElement)
  }

  async showComponentList() {
    const modal = await this.modalController.create({
      component: PageElementListComponent,
      cssClass: 'my-custom-class'
    });
    const present = await modal.present();
    const { data } = await modal.onWillDismiss();
    this.renderComponent(data);

    return present;
  }

  renderComponent(componentName: string) {
    if (componentName) {
      
      const factory = this.componentFactoryResolver.resolveComponentFactory(this.components[componentName]);
      this.pageElement.createComponent(factory);
    }
  }


}
