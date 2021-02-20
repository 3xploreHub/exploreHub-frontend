import { Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AlertController, IonContent, ModalController } from '@ionic/angular';
import { ElementComponent } from '../../interfaces/element-component';
import { ElementValues } from '../../interfaces/ElementValues';
import { FooterData } from '../../interfaces/footer-data';
import { PageCreatorService } from '../../page-creator/page-creator-service/page-creator.service';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})

export class ItemListComponent implements OnInit {
  @ViewChild('pageElement', { read: ViewContainerRef }) pageElement: ViewContainerRef;
  @ViewChild('itemList') itemList;
  @Input() values: ElementValues;
  @ViewChild('newItem') newItemAdded: ElementRef;
  @Input() parentId: string;
  public footerData: FooterData;
  public showPopup: boolean = false;
  components = {
    'item': ItemComponent
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
      hasValue: false,
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
      this.footerData.hasValue = this.values.data? true: false;
      this.footerData.hasId = true;
      this.footerData.isDefault = this.values.default;
    } else {
      this.footerData.done = false;
      this.values = { _id: "", type: "item-list", styles: [], data: [], default: false };
      this.footerData.message = "Adding Field..."
      this.addComponent(false);
    }
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
    this.renderChildren(false)
  }
    
  

  renderItemList() {
    this.showPopup = false;
    this.creator.getUpdatedItemListData(this.values._id).subscribe((newData: ElementValues) => {
      console.log(newData);
      this.values = newData[0].services[0]
        if (this.checkIfHasItems(this.values.data)) {
          this.footerData.done = true;
        } else {
          this.presentAlert("Please fill up every fields, or press 'done' if you have given them some value already.")
        }
    })
  }

  renderComponent(componentName: string, componentValues: any) {
    if (componentName) {
      console.log(this.pageElement);
      
      const factory = this.componentFactoryResolver.resolveComponentFactory<ElementComponent>(this.components[componentName]);
      const comp = this.pageElement.createComponent<ElementComponent>(factory);
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
    items.forEach(item => {
      if (item.data.length > 0) {
        if (this.creator.checkIfHasValue(item.data)) values.push(item.data)
      }
    });
    return values.length == items.length
  }

}
