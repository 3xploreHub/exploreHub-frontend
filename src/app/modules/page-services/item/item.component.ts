import { RecursiveAstVisitor } from '@angular/compiler/src/output/output_ast';
import { AfterContentChecked, ChangeDetectorRef, Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ElementComponent } from '../../interfaces/element-component';
import { ElementValues } from '../../interfaces/ElementValues';
import { FooterData } from '../../interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';
import { PageElementListComponent } from '../../page-element-list/page-element-list.component';
import { LabelledTextComponent } from '../../page-elements/labelled-text/labelled-text.component';
import { PhotoComponent } from '../../page-elements/photo/photo.component';
import { TextComponent } from '../../page-elements/text/text.component';
import { ItemDisplayComponent } from '../../page-services-display/item-display/item-display.component';

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
  public showPopup: boolean;

  components = {
    'text': TextComponent,
    'labelled-text': LabelledTextComponent,
    'photo': PhotoComponent,
  }

  constructor(
    public modalController: ModalController,
    public componentFactoryResolver: ComponentFactoryResolver,
    public creator: PageCreatorService,
    public alert: AlertController,
    private cdr: ChangeDetectorRef
  ) {
    this.footerData = {
      done: false,
      deleted: false,
      saving: false,
      message: "Saving Changes...",
      hasValue: true,
      hasId: false,
      isDefault: false,
      hasStyle: false
    }
  }

  ngOnInit() {
    if (this.values) {
      let data = this.values.data
      // this.footerData.done = this.values.data? true: false;
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
      this.renderChildren();
    } else {
      this.footerData.done = false;
      this.values = { _id: "", type: "item", styles: [], data: [], default: false };
      this.footerData.message = "Adding Field..."
      this.addComponent(false);
    }
  }



  async showComponentList() {
    const modal = await this.modalController.create({
      component: PageElementListComponent,
      cssClass: 'componentListModal'
    });
    const present = await modal.present();
    const { data } = await modal.onWillDismiss();
    this.renderComponent(data, null, true);

    return present;
  }

  edit() {
    this.showPopup = false;
    this.renderChildren(false);
    this.footerData.done = false;
  }

  renderChildren(isEditing: boolean = true) {
    this.footerData.saving = true;
    this.footerData.message = "Loading..."
    setTimeout(() => {
      this.footerData.saving = false;
      this.footerData.message = "Saving Changes..."
      if (this.values.data.length > 0) {
        this.setPage(this.values.data)
      }
    }, 1000);
  }

  setPage(component) {
    component.forEach((component: any) => {
      this.renderComponent(component.type, component)
    })
  }

  renderComponent(componentName: string, componentValues: any, isNew: boolean = false) {
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
        this.renderChildren();
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
    
    this.creator.getItemUpdatedData(this.parentId, this.values._id).subscribe((updatedData: ElementValues) => {
      this.values = updatedData[0].services[0].data[0]
      if (this.creator.checkIfHasValue(this.values.data)) {
        this.footerData.done = true;
      } else {
        this.presentAlert("Please fill up every fields, or press 'done' if you have given them some value already.")
      }
    })
  }



  getUpdates(newData) {
    this.values = newData;
  }

  addChild(newChild) {
    this.values.data.push(newChild);
    console.log("new child", newChild)
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
