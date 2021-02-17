import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ElementComponent } from '../../interfaces/element-component';
import { ElementValues } from '../../interfaces/ElementValues';
import { FooterData } from '../../interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';
import { PageElementListComponent } from '../../page-element-list/page-element-list.component';
import { LabelledTextComponent } from '../../page-elements/labelled-text/labelled-text.component';
import { PhotoComponent } from '../../page-elements/photo/photo.component';
import { TextComponent } from '../../page-elements/text/text.component';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})

export class ItemComponent implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  @Input() values: ElementValues;
  @Input() parentId: string;
  @Input() parent: string;
  public footerData: FooterData;

  components = {
    'text': TextComponent,
    'labelled-text': LabelledTextComponent,
    'photo': PhotoComponent,
    // 'item-list': ItemComponent
  }

  constructor(
    public modalController: ModalController,
    public componentFactoryResolver: ComponentFactoryResolver,
    public creator: PageCreatorService,
    public alert: AlertController
  ) {
    this.footerData = {
      done: false,
      deleted: false,
      saving: false,
      message: "Saving Changes...",
      hasValue: false,
      hasId: false,
      isDefault: false,
      hasStyle: false
    }
  }

  ngOnInit() {
    console.log(this.values)
    if (this.values) {
      let data = this.values.data
      this.footerData.done = data.text && data.label ? true : false;
      this.footerData.hasValue = data.text != null && data.label != null;
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
      this.footerData.saving = true;
      this.footerData.message = "Loading..."
      setTimeout(() => {
        this.footerData.saving = false; 
        this.footerData.message = "Saving Changes..."
        if (this.values.data.length > 0) {
          this.footerData.done = true;
          this.setPage(this.values.data)
        }
      }, 1000);
    } else {
      this.footerData.done = false;
      this.values = { _id: "", type: "item", styles: [], data: [], default: false };
      this.footerData.message = "Adding Field..."
      this.addComponent(false);
    }
  }

  setPage(component) {
    component.forEach((component: any) => {
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
      comp.instance.parentId = this.values._id;
      comp.instance.grandParentId = this.parentId;
      comp.instance.parent = "component";
    }
  }

  addComponent(isDone: boolean = true) {
    this.footerData.saving = true;
    this.creator.saveItemComponent(this.values, this.parentId, this.parent).subscribe(
      (response) => {
        this.values = response;
        this.footerData.hasId = true;
      },
      (error) => {
        this.presentAlert("Oops! Something went wrong. Please try again later!")
      },
      () => {
        this.done(isDone);
      }
    )
  }

  renderService() {
    alert("render")
  }
  delete() {
    if (this.values._id) {
      this.footerData.message = "Deleting..."
      this.footerData.saving = true;
      this.creator.deleteItemComponent(this.parentId, this.values._id).subscribe(
        (response) => {
          this.footerData.deleted = true;
        },
        (error) => {
          this.presentAlert("Oops! Something went wrong. Please try again later!")
        },
        () => {
          this.done();
        }
      )
    } else {
      this.footerData.deleted = true;
    }
  }

  done(done: boolean = true) {
    this.footerData.done = done;
    this.footerData.saving = false;
    this.footerData.message = "Saving  Changes...";
    // this.hasChanges = false;
  }

  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }
}
