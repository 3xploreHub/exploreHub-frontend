import { RecursiveAstVisitor } from '@angular/compiler/src/output/output_ast';
import { AfterContentChecked, ChangeDetectorRef, Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ElementComponent } from '../../elementTools/interfaces/element-component';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { FooterData } from '../../elementTools/interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';
import { PageElementListComponent } from '../../page-element-list/page-element-list.component';
import { BulletFormTextComponent } from '../../page-elements/bullet-form-text/bullet-form-text.component';
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
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef = null;
  @Output() onDelete: EventEmitter<any> = new EventEmitter()
  @Output() passDataToParent: EventEmitter<any> = new EventEmitter()
  @Input() values: ElementValues;
  @Input() parentId: string;
  @Input() parent: string;
  public tempId: any;
  public footerData: FooterData;

  components = {
    'text': TextComponent,
    'labelled-text': LabelledTextComponent,
    'photo': PhotoComponent,
    'bullet-form-text': BulletFormTextComponent,
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
    if (this.values && typeof this.values != 'string') {
      // this.footerData.done = this.creator.checkIfHasValue(this.values.data)
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
      this.renderChildren();
    } else {
      this.tempId = this.values
      this.footerData.done = false;
      this.values = { _id: "", type: "item", styles: [], data: [], default: false };
      this.footerData.message = "Adding Field..."
      this.addComponent(false);
    }
  }


  async showComponentList() {
    setTimeout(async () => {

      const modal = await this.modalController.create({
        component: PageElementListComponent,
        cssClass: 'componentListModal',
        componentProps: {
          insideItem: true,
        }
      });
      const present = await modal.present();
      let { data } = await modal.onWillDismiss();
      let values = null

      if (data && data.includes("_")) {
        const str = data.split("_");
        let type = str[1];
        data = str[0];
        let label = type == "price" ? "Price" : "Quantity";
        values = { type: "labelled-text", data: { label: label, text: null, defaultName: type, booked: 0 }, styles: [], default: false }
      }
      this.renderComponent(data, values, true);

      return present;
    }, 200);
  }

  edit() {
    this.creator.clickedComponent = null;
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
      if (this.pageElement) {
        const comp = this.pageElement.createComponent<ElementComponent>(factory);
        comp.instance.values = componentValues;
        comp.instance.parentId = this.values._id;
        comp.instance.grandParentId = this.parentId;
        comp.instance.parent = "component";
      }
    }
  }

  addComponent(isDone: boolean = true) {
    this.footerData.saving = true;
    this.creator.saveItem(this.values, this.parentId).subscribe(
      (response) => {
        this.values = response;
        this.footerData.hasId = true;
        this.passDataToParent.emit({ tempId: this.tempId, values: this.values });
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
    this.footerData.saving = true;
    setTimeout(() => {
      this.creator.getItemUpdatedData(this.parentId, this.values._id).subscribe((updatedData: ElementValues) => {
        this.values = updatedData[0].services[0].data[0]
        this.footerData.saving = false;
        if (this.creator.checkIfHasValue(this.values.data)) {
          this.footerData.done = true;
        } else {
          if (this.values.data.length == 0) {
            this.presentAlert("Please add info about this service");
          } else {
            this.presentAlert("Please fill up each field and hit 'done' to save the changes. ")
          }
        }
      })
    }, 300);
  }

  getUpdates(newData) {
    this.values = newData;
  }

  addChild(newChild) {
    this.values.data.push(newChild);
  }

  delete() {
    if (this.values._id) {
      this.footerData.message = "Deleting..."
      this.footerData.saving = true;
      this.creator.deleteItem(this.parentId, this.values._id).subscribe(
        (response) => {
          this.footerData.deleted = true;
          this.onDelete.emit(this.values._id)
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
