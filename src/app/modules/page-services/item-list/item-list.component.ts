import { Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
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

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})

export class ItemListComponent implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  @ViewChild('listInfo', { read: ViewContainerRef }) listInfo: ViewContainerRef;
  @ViewChild('itemList') itemList;
  @Input() values: ElementValues;
  @ViewChild('newItem') newItemAdded: ElementRef;
  @Input() parentId: string;
  public footerData: FooterData;
  public items: ElementValues[] = [];
  public newlyAdded: number;
  public deletedItem: string[] =[]
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  components = {
    'item': ItemComponent,
    'text': TextComponent,
    'labelled-text': LabelledTextComponent,
    'photo': PhotoComponent,
  }

  constructor(
    public modalController: ModalController,
    public componentFactoryResolver: ComponentFactoryResolver,
    public creator: PageCreatorService,
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
      let data = this.values.data
      this.renderChildren()
      // this.footerData.done = this.values.data? true: false;
      this.footerData.done = false;
      this.footerData.hasValue = this.values.data ? true : false;
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
       this.items = this.values.data.filter(item => item.type == 'item')

    } else {
      this.footerData.done = false;
      this.values = { _id: "", type: "item-list", styles: [], data: [], default: false };
      this.footerData.message = "Adding Field..."
      this.addComponent(false);
    }

    alert(this.items.length)
  }

  deleteItem(id) {
    this.items = this.items.filter(item => item && item._id != id);
    this.deletedItem.push(id)
  }

  getItemData(data) {
    this.items = this.items.map(item => {
      if (typeof item == "string" && item == data.tempId) item = data.values
      return item;
    })
    console.log(this.items);
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

  // setPage(component) {
  //   if (component.length > 0) {
  //     component.forEach((component: any) => {
  //       this.renderComponent(component.type, component)
  //     })
  //   }
  // }

  addItem() {
    // this.renderComponent("item", null);
    this.items.push(uuidv4())
    setTimeout(() => {
      this.newItemAdded.nativeElement.scrollLeft = this.newItemAdded.nativeElement.scrollWidth + 350;
    }, 300);
  }

  edit() {
    this.footerData.done = false;
    this.renderChildren()
  }

  renderItemList() {
    this.creator.clickedComponent = null
    this.footerData.saving = true;
    setTimeout(() => {
      this.creator.getUpdatedItemListData(this.values._id).subscribe((newData: ElementValues) => {
        this.values = newData[0].services[0]
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

  checkIfHasItems(items) {
    let values = [];
    if (items.length == 0) {
      this.presentAlert("Please add info about this service")
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
      this.presentAlert("Please fill up each field and hit 'done' to save the changes.")
      return false;
    }
    return true
  }

}
