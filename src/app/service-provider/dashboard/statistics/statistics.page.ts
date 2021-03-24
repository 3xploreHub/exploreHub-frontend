import { Component, OnInit, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { element } from 'protractor';
import { ElementValues } from 'src/app/modules/elementTools/interfaces/ElementValues';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';
import { LabelledTextDisplayComponent } from 'src/app/modules/page-elements-display/labelled-text-display/labelled-text-display.component';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  public services: ElementValues[];
  public pageId: string;
  public pageType: string;
  public scrollList: boolean = false;
  public itemClicked: boolean;
  public updateClicked: boolean = false;
  public amount: number = 1;
  public updating: boolean;
  public expandList: string;
  public itemToUpdate: ElementValues;
  public serviceId: string;
  public amountForQuantity: number = 1;
  public amountForAvailable: number = 1;

  constructor(
    public creator: PageCreatorService,
    public mainService: MainServicesService,
    public router: Router,
    public alert: AlertController,
    public toastController: ToastController) { }

  ngOnInit() {
    const url = this.router.url.split('/').reverse();
    this.pageId = url[2]
    this.pageType = url[3]
    this.mainService.getServices(url[2], url[3]).subscribe(
      (response: Page) => {
        this.services = response.services;
        console.log(this.services);
        console.log(this.services[0].data[0]);
        
      },

    )
  }

  getItemName(item) {
    const name = item.data.filter(comp => comp.data.defaultName == 'name')
    return name.length > 0 && name[0].data.text ? name[0].data.text : 'Untitled';
  }

  filterItem(data) {
    return data.filter(item => item.type == "item")
  }

  getValue(item, type, format = true) {
    const quantity = item.filter(comp => comp.data.defaultName == type);
    if (quantity.length > 0 && quantity[0].data.unlimited) {
      return "Unli.";
    }
    return quantity.length > 0 ? format ? this.formatNumber(quantity[0].data.text) : quantity[0].data.text : type == 'price' ? 'none' : 'Unli.'
  }

  getBooked(item) {
    const comp = item.filter(comp => comp.data.defaultName == 'quantity');
    return comp.length > 0 ? comp[0].data.booked ? comp[0].data.booked : 0 : 0;
  }

  formatNumber(data) {
    let m = data.toString();
    let val = m.includes(".") ? "." + m.split(".")[1] : ""
    m = m.includes(".") ? m.split(".")[0] : m
    m = m.split("").reverse().join("")
    let num = "";
    for (let i = 0; i < m.length; i++) {
      let n = (i + 1) % 3 == 0 ? i == m.length - 1 ? m[i] : m[i] + "," : m[i]
      num += n;
    }
    val = num.split("").reverse().join("") + val;
    return val;
  }

  countServices(service) {
    let count = 0;
    service.data.forEach(element => {
      count += element.type == "item" ? 1 : 0;
    });
    return count;
  }

  getTotalQuantity(item_list) {
    let result = 0;
    item_list.data.forEach(item => {
      if (item.type == "item") {
        const res = this.getValue(item.data, "quantity", false)
        if (res != 'none' && res != 'Unli.') {
          result += Number(res);
        }
      }
    });
    return result;
  }

  clickOutside(e) {
    e.stopPropagation();
    this.updateClicked = false;
    this.itemClicked = null
  }

  clickItem(e) {
    e.stopPropagation();
  }

  updateItemQuantity(e, serviceId, item, amount, valueToEdit, add = false) {
    // if (!this.updating) {
    //   e.stopPropagation();
    //   setTimeout(() => {
    //     const type = 'quantity';
    //     let component = item.data.filter(comp => comp.data.defaultName == 'quantity')
    //     let values = component.length > 0 ? { ...component[0], data: { ...component[0].data } } : null
    //     this.creator.currentPageId = this.pageId;
    //     this.creator.pageType = this.pageType

    //     let valid = true;
    //     let error = ""
    //     if (values) {
    //       if (valueToEdit == "quantity") {
    //         const res = this.updateQuant(values.data.text, add, amount);
    //         if (res <= -2 && !values.data.unlimited || (values.data.unlimited && !add)) {
    //           valid = false;
    //           // error = "Cannot set quantity less than 0"
    //         } else if (res == -1 ) {

    //           values.data['unlimited'] = true;
    //           values.data.text = 0;
              
    //         } else {
    //           values.data['unlimited'] = false
    //           if (res < values.data.booked && !add && values.data.booked) {
    //             valid = false;


    //             this.presentAlert((res + 1) + (res == 1 ? " item is " : " items are ") + "currently booked")
    //             values.data.text = res;
    //           }
    //         }
    //       } else {
    //         if (!values.data.booked) {
    //           values.data['booked'] = 0
    //         }

    //         values.data.booked = this.updateQuant(values.data.booked, add, amount);
    //         // const bookedOnline = 3
    //         // const count = values.data.booked;
    //         // if (values.data.booked > 0 && values.data.booked < bookedOnline && !add) {
    //         //   this.presentAlert((count + 1) + (count == 1 ? " item is " : " items are ") + " booked online")
    //         //   valid = false;
    //         // } else

    //          if (values.data.booked > values.data.text && !values.data.unlimited) {
    //           valid = false;
    //           error = "No more available"
    //         } else if (values.data.booked <= -1) {
    //           valid = false;
    //         }
    //       }
          
    //       if (valid) {
    //         this.updating = true;
    //         this.creator.editComponent(values, serviceId, item._id, "component").subscribe(
    //           (response) => {
    //             this.updating = false;
    //             let data = component.length > 0 ? component[0] : null
    //             if (valueToEdit == 'quantity') {
                  
    //               // data.data.text = this.updateQuant(data.data.text, add, amount);
    //               data.data = values.data;
    //               if (data.data.text <= -1) { 
    //                 data.data['unlimited'] = true
    //                 data.data.text = -1;
    //               } else {
    //                 data.data['unlimited'] = false;
    //               }
                  
    //               if (parseInt(data.data.text) == 0) {
    //                 this.presentAlert("This item will no longer be visible online to customers");
    //               }
    //             } else {
    //               if (!data.data.booked) {
    //                 data.data['booked'] = 0
    //               }
    //               data.data.booked = this.updateQuant(data.data.booked, add, amount);
    //             }

    //           }, error => {
    //             this.presentAlert("Unexpected error occured!")
    //           }
    //         )
    //       } else {
    //         if (error) this.presentToast(error)
    //       }

    //     } else {
    //       if (add) {
    //         const quantity = this.addQuantity(add, amount, type, valueToEdit);
    //         const newData: ElementValues = { _id: null, ...quantity };
    //         this.updating = true;

    //         this.creator.saveComponent(newData, serviceId, item._id, "component").subscribe(
    //           (response: ElementValues) => {
    //             this.updating = false;
    //             item.data.push(response);

    //           }, (error) => {
    //             this.presentAlert("Oops! Something went wrong. Please try again later!")
    //           },
    //         )
    //       }
    //     }
    //   }, 200);
    // }
  }

  addQuantity(add, amount, type, valueToEdit) {
    let values = { type: "labelled-text", data: { label: type[0].toUpperCase() + type.substring(1), text: 0, defaultName: type, booked: 0, unlimited: true }, styles: [], default: false }
    if (valueToEdit == "quantity") {
      values.data.text = this.updateQuant(values.data.text, add, amount);
    } else {
      values.data.booked = this.updateQuant(values.data.booked, add, amount);
    }
    return values;
  }

  updateQuant(value, add, amount) {
    let num = parseInt(value);
    return add ? num + amount : num > 0 ? num - amount : -1;
  }

  updateItem(e) {
    e.stopPropagation()
    setTimeout(() => {
      this.updateClicked = true
      alert(this.updateClicked)
    }, 200);
  }

  closeModal(e) {
    e.stopPropagation();
    this.itemToUpdate = null;
    this.serviceId = null;
    this.itemClicked = null;
  }

  exitExpand(e) {
    e.stopPropagation();
    this.expandList = null
    this.itemClicked = null;
  }

  clickInside(e) {
    e.stopPropagation();
  }

  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000
    });
    toast.present();
  }

  checkAmount(amount, quantity = false) {
    if (amount < 0) {
      this.presentToast("Cannot set amount less than or equal to 0")
      if (quantity) {
        this.amountForQuantity = 1;
      } else {
        this.amountForAvailable = 1;
      }
    }

  }

}
