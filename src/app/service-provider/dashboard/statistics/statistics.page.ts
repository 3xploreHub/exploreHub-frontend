import { Component, OnInit, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { element } from 'protractor';
import { ElementValues } from 'src/app/modules/elementTools/interfaces/ElementValues';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { PageCreatorService } from 'src/app/modules/page-creator/page-creator-service/page-creator.service';
import { LabelledTextDisplayComponent } from 'src/app/modules/page-elements-display/labelled-text-display/labelled-text-display.component';
import { MainServicesService } from '../../provider-services/main-services.service';

export interface modalData {
  pageId: string;
  pageType: string;
  serviceId: string;
  item: ElementValues;
  itemName: string;
  itemQuantity: number,
  quatityPercentage: number,
  manuallyBookedPercent: number,
  serviceGroupName: string,
  toBeBooked: number,
  processingPercent: number,
  pendingPercent: number,

}
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
  public totalBooked: number = 0;
  public updateItem: boolean = false;
  public modalData: modalData;
  loading = true
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
    this.getPageServices()

    this.mainService.notification.subscribe(
      (data: any) => {
        const notifType = data.type.split("-")[1];
        if (notifType == "fromTourist" || notifType == "fromAdmin" && data.booking) {
          this.getPageServices()
        }
      }
    )
  }

  getPageServices() {
    this.mainService.getServices(this.pageId, this.pageType).subscribe(
      (response: Page) => {
        this.loading = false
        this.services = response.services;
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

  getServiceTotalPercentage(booked, total) {
    return booked / total * 100
  }

  getProcessingTotal(service) {
    let total = 0;
    service.forEach(item => {
      if (item.type == "item") {
        if (item.toBeBooked) {
          total += parseInt(item.toBeBooked)
        }

      }
    });
    return total;
  }

  getPendingTotal(service) {
    let total = 0;
    service.forEach(item => {
      if (item.type == "item") {
        if (item.pending) {
          total += parseInt(item.pending)
        }

      }
    });
    return total;
  }

  getBookedTotal(service, manual = false) {
    let total = 0;
    service.forEach(item => {
      if (item.type == "item") {
        if (manual && item.manuallyBooked) {
          total += parseInt(item.manuallyBooked)
        } else if (!manual && item.booked) {
          total += parseInt(item.booked)
        }

      }
    });
    return total;
  }

  getTotalOccupied(data) {
    return this.getBookedTotal(data) + this.getBookedTotal(data, true) + this.getProcessingTotal(data) + this.getPendingTotal(data)
  }

  getPercentage(item, manual = false) {
    const booked = item.booked ? item.booked : 0
    const manuallyBooked = item.manuallyBooked ? item.manuallyBooked : 0
    const toBeBooked = item.toBeBooked ? item.toBeBooked : 0
    const pending = item.pending ? item.pending: 0
    let quantity = this.getValue(item.data, 'quantity')
    quantity = quantity ? quantity : 0
    const quant = manual ? booked + manuallyBooked + toBeBooked + pending : quantity
    const total = manual ? manuallyBooked : booked + manuallyBooked + toBeBooked + pending
    const result = total / quant * 100
    if (result == NaN) return 0
    return result
  }

  getProcessingPercent(item) {
    const booked = item.booked ? item.booked : 0
    const manuallyBooked = item.manuallyBooked ? item.manuallyBooked : 0
    const toBeBooked = item.toBeBooked ? item.toBeBooked : 0
    const pending = item.pending ? item.pending: 0
    const total = booked + manuallyBooked + toBeBooked + pending
    const result = toBeBooked / total * 100
    if (result == NaN) return 0
    return result
  }

  getPendingPercent(item) {
    const booked = item.booked ? item.booked : 0
    const manuallyBooked = item.manuallyBooked ? item.manuallyBooked : 0
    const toBeBooked = item.toBeBooked ? item.toBeBooked : 0
    const pending = item.pending ? item.pending: 0
  
    const total = booked + manuallyBooked + toBeBooked + pending
    const result = pending / total * 100
    if (result == NaN) return 0
    return result
  }


  clickItemToUpdate(item, service) {
    setTimeout(() => {

      const quantity = this.getValue(item.data, 'quantity')
      this.updateItem = true;
      this.modalData = {
        pageId: this.pageId,
        pageType: this.pageType,
        serviceId: service._id,
        item: item,
        itemName: this.getItemName(item),
        itemQuantity: quantity,
        quatityPercentage: this.getPercentage(item),
        manuallyBookedPercent: this.getPercentage(item, true),
        serviceGroupName: service.data[0].data.text,
        toBeBooked: item.toBeBooked,
        processingPercent: this.getProcessingPercent(item),
        pendingPercent: this.getPendingPercent(item)
      }
      console.log(this.modalData)
    }, 100);
  }

  modalClosed() {
    this.updateItem = false;

  }

}
