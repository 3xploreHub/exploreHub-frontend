
import { Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AlertController, IonSlides, ModalController, ToastController } from '@ionic/angular';
import { ElementComponent } from '../../elementTools/interfaces/element-component';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';
import { FooterData } from '../../elementTools/interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';
import { PageElementListComponent } from '../../page-element-list/page-element-list.component';
import { LabelledTextComponent } from '../../page-elements/labelled-text/labelled-text.component';
import { PhotoComponent } from '../../page-elements/photo/photo.component';
import { TextComponent } from '../../page-elements/text/text.component';
import { ItemComponent } from '../item/item.component';
import { v4 as uuidv4 } from 'uuid';
import { ThrowStmt } from '@angular/compiler';
import { BulletFormTextComponent } from '../../page-elements/bullet-form-text/bullet-form-text.component';
export interface serviceValues {
  _id: string;
  type: string;
  data: any;
  styles: string[];
  default: boolean;
  required: boolean;
  selectMultiple: boolean;
  inputQuantity: boolean;
}
@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})



export class ItemListComponent implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  @ViewChild('listInfo', { read: ViewContainerRef }) listInfo: ViewContainerRef;
  @ViewChild('itemList') itemList;
  @Input() values: serviceValues;
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild('newItem') newItemAdded: ElementRef;
  @Input() parentId: string;
  public footerData: FooterData;
  public items: ElementValues[] = [];
  public newlyAdded: number;
  public deletedItem: string[] = []

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  components = {
    'item': ItemComponent,
    'text': TextComponent,
    'labelled-text': LabelledTextComponent,
    'bullet-form-text': BulletFormTextComponent,
    'photo': PhotoComponent,
  }

  constructor(
    public modalController: ModalController,
    public componentFactoryResolver: ComponentFactoryResolver,
    public creator: PageCreatorService,
    public toastController: ToastController,
    public alert: AlertController,
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
      this.renderChildren()
      const res = this.checkIfHasItems(this.values.data, false)
      this.footerData.done = res;
      this.footerData.hasValue = this.values.data ? true : false;
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
      this.items = this.values.data.filter(item => item.type == 'item')
    } else {
      this.footerData.done = false;
      this.values = { _id: "", type: "item-list", styles: [], data: [], default: false, inputQuantity: false, selectMultiple: false, required: false };
      this.footerData.message = "Adding Field..."
      this.addComponent(false);
    }
  }

  deleteItem(id) {
    this.items = this.items.filter(item => item && item._id != id);
    this.deletedItem.push(id)
  }

  getItemData(data) {
    this.items = this.items.map(item => {
      if (typeof item == "string" && item == data.tempId) {
        item = data.values
      } else if (data._id == item._id) {
        item = data
      }
      return item;
    })
  }

  setItems(data) {
    this.items = data.filter(item => item.type == 'item')
  }

  renderChildren() {
    this.footerData.saving = true;
    this.footerData.message = "Loading..."
    setTimeout(() => {
      this.footerData.saving = false;
      this.footerData.message = "Saving Changes..."
      if (this.values.data.length > 0) {
        this.values.data.forEach((component: any) => {
          this.renderComponent(component.type, component)
        })
      }
    }, 1000);
  }

  editServiceSettings() {
    this.footerData.saving = true;
    this.creator.editServiceSettings({
      serviceId: this.values._id,
      required: this.values.required,
      selectMultiple: this.values.selectMultiple,
      inputQuantity: this.values.inputQuantity
    }).subscribe(
      (response: any) => {
        this.footerData.saving = false;
      }
    )
  }

  addItem() {
    this.items.push(uuidv4())
    if (this.slides) {
      setTimeout(() => {
        this.slides.slideTo(this.items.length, 500);
      }, 100);
    }
  }

  edit() {
    this.footerData.saving = true;
    this.footerData.message = "loading..."
    setTimeout(() => {
      this.creator.getUpdatedItemListData(this.values._id).subscribe((newData: any) => {
        this.values.data = newData
        this.footerData.done = false;
        this.footerData.saving = false;
        this.renderChildren()
        this.items = this.values.data.filter(item => item.type == 'item')
      })
    }, 300)
  }

  renderItemList() {
    this.creator.clickedComponent = null
    this.footerData.saving = true;
    const info = this.values.data.filter(data => data.type != "item")
    this.values.data = [...info, ...this.items]

    setTimeout(() => {
      this.creator.getUpdatedItemListData(this.values._id).subscribe((newData: any) => {
        this.values.data = newData
        this.footerData.saving = false
        if (this.checkIfHasItems(this.values.data)) {
          this.footerData.done = true;
        }
      })
    }, 300);
  }

  renderComponent(componentName: string, componentValues: any) {
    if (componentName && componentName != "item") {
      if (this.listInfo) {
        const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentName]);
        const comp = this.listInfo.createComponent<ElementComponent>(factory);
        comp.instance.values = componentValues;
        comp.instance.parentId = this.values._id;
        comp.instance.parent = "service";
      }
    }
  }

  addComponent(isDone: boolean = true) {
    this.footerData.saving = true;
    this.creator.saveServiceComponent(this.values, this.parentId).subscribe(
      (response) => {
        this.values = response;
        this.footerData.hasId = true;
        this.items = this.values.data.filter(item => item.type == 'item')
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


  async showComponentList() {
    setTimeout(async () => {

      const modal = await this.modalController.create({
        component: PageElementListComponent,
        cssClass: 'componentListModal',
        componentProps: {
          isInItemList: true,
        }
      });
      const present = await modal.present();
      const { data } = await modal.onWillDismiss();
      this.renderComponent(data, null);
      return present;
    }, 200);
  }


  delete() {
    if (this.values._id) {
      this.footerData.message = "Deleting..."
      this.footerData.saving = true;
      this.creator.deleteServiceComponent(this.parentId, this.values._id).subscribe(
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

  checkIfHasItems(items, alert = true) {
    let values = [];
    if (items.length <= 1) {
      if (alert) {
        this.presentAlert("Please add info about this service")
      }
      return false
    }


    items.forEach(service => {
      if (service.type != "item") {
        if (this.creator.checkIfHasValue([service])) {
          values.push(service);
        }
      }
      else if (service.data.length > 0) {
        if (this.creator.checkIfHasValue(service.data)) values.push(service.data)
      }
    });
    if (values.length != items.length) {
      if (alert) {
        this.presentAlert("Please fill up each field.")
      } return false;
    }
    return true
  }

  async presentToast(message) {
    if (message == 'Preview') message = "You are in preview mode, click 'edit' button to edit page"
    const toast = await this.toastController.create({
      message: message,
      duration: 1000
    });
    toast.present();
  }

}
