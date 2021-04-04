import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { modalData } from '../../dashboard/statistics/statistics.page';

@Component({
  selector: 'app-update-item-popup',
  templateUrl: './update-item-popup.component.html',
  styleUrls: ['./update-item-popup.component.scss', "../../dashboard/statistics/statistics.page.scss"],
})
export class UpdateItemPopupComponent implements OnInit {
  @Input() show: boolean = false;
  @Output() close: EventEmitter<any> = new EventEmitter()
  @Input() data: modalData; 
  constructor() {
   this.data = {
      pageId: "",
      pageType: "",
      serviceId: "",
      item: null,
      itemName: "",
      itemQuantity: 0,
      quatityPercentage: 0,
      manuallyBookedPercent: 0,
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



}
