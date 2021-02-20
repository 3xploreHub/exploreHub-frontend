import { Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ElementComponent } from '../../interfaces/element-component';
import { ElementValues } from '../../interfaces/ElementValues';
import { FooterData } from '../../interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';
import { LabelledTextComponent } from '../../page-elements/labelled-text/labelled-text.component';
import { PhotoComponent } from '../../page-elements/photo/photo.component';
import { TextComponent } from '../../page-elements/text/text.component';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})

export class ItemListComponent implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;//listInfo
  @ViewChild('listInfo', { read: ViewContainerRef }) listInfo: ViewContainerRef;
  @ViewChild('itemList') itemList;
  @Input() values: ElementValues;
  @ViewChild('newItem') newItemAdded: ElementRef;
  @Input() parentId: string;
  public footerData: FooterData;
  public showPopup: boolean = false;
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
    } else {
      this.footerData.done = false;
      this.values = { _id: "", type: "item-list", styles: [], data: [], default: false };
      this.footerData.message = "Adding Field..."
      this.addComponent(false);
    }
  }

  renderChildren() {
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
    if (component.length > 0) {
      component.forEach((component: any) => {
        this.renderComponent(component.type, component)
      })
    }
  }

  addItem() {
    this.renderComponent("item", null);
    setTimeout(() => {
      this.newItemAdded.nativeElement.scrollLeft = this.newItemAdded.nativeElement.scrollWidth + 350;
    }, 300);
  }

  edit() {
    this.footerData.done = false;
    this.renderChildren()
  }



  renderItemList() {
    this.showPopup = false;
    this.footerData.saving = true;
    this.creator.getUpdatedItemListData(this.values._id).subscribe((newData: ElementValues) => {
      console.log(newData);
      this.values = newData[0].services[0]
      this.footerData.saving = false
      if (this.checkIfHasItems(this.values.data)) {
        this.footerData.done = true;
      }
    })
  }

  renderComponent(componentName: string, componentValues: any) {
    if (componentName) {
      let domRef = this.pageElement;
      if (componentName != "item") {
        domRef = this.listInfo;
      }
      const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentName]);
      const comp = domRef.createComponent<ElementComponent>(factory);
      comp.instance.values = componentValues;
      comp.instance.parentId = this.values._id;
      comp.instance.parent = "component";
    }
  }

  addComponent(isDone: boolean = true) {
    this.footerData.saving = true;
    this.creator.saveServiceComponent(this.values, this.parentId).subscribe(
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


    items.forEach(item => {
      if (items.type != "item") {
        if (this.creator.checkIfHasValue([items])) {
          values.push(item);
          console.log("default: ", this.creator.checkIfHasValue([items]))
        }
      }
      else if (item.data.length > 0) {
        if (this.creator.checkIfHasValue(item.data)) values.push(item.data)
      }
    });
    if (values.length != items.length) {
      this.presentAlert("Please fill up each field and hit 'done' to save the changes.")
      return false;
    }
    return true
  }

}
