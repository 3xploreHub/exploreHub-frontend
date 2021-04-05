import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { modalData } from '../../dashboard/statistics/statistics.page';
import { bookingData } from '../../provider-services/interfaces/bookingData';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-update-item-popup',
  templateUrl: './update-item-popup.component.html',
  styleUrls: ['./update-item-popup.component.scss'],
})
export class UpdateItemPopupComponent implements OnInit {
  @Input() show: boolean = false;
  @Output() close: EventEmitter<any> = new EventEmitter()
  @Input() data: modalData;
  constructor(public mainService: MainServicesService, public router: Router, public alertController: AlertController) {
    this.data = {
      pageId: "",
      pageType: "",
      serviceId: "",
      item: null,
      itemName: "",
      itemQuantity: 0,
      quatityPercentage: 0,
      manuallyBookedPercent: 0,
      serviceGroupName: "",
    }
  }

  ngOnInit() {
  }

  closeModal(e) {
    e.stopPropagation()
    this.show = false;
    this.close.emit();
  }

  clickInsidePopup(e) {
    e.stopPropagation()
  }

  createBooking() {
    setTimeout(() => {
      const item = this.data.item
      if (item["manuallyBooked"] + 1 > this.data.itemQuantity) {
        this.presentAlert("No more available!")
      } else {
        const firstServiceSelected = { service: this.data.item._id, serviceGroupName: this.data.serviceGroupName, serviceGroupId: this.data.serviceId }
        const data = { pageId: this.data.pageId, isManual: true, pageType: this.data.pageType, firstService: firstServiceSelected, bookingId: "create_new" };
        this.mainService.createBooking(data).subscribe(
          (response: bookingData) => {
            this.mainService.creatingManual = true;
            this.router.navigate(["/service-provider/select-service", this.data.pageId, response._id])
          })
      }
    }, 300);
  }
  async presentAlert(message) {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

}