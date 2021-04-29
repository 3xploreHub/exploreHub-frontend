import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { popupData } from '../../view-booking-as-provider/view-booking-as-provider.page';

@Component({
  selector: 'app-confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.scss'],
})
export class ConfirmPopupComponent implements OnInit {
  @Input() popupData: popupData;
  @Output() clicked:EventEmitter<any> = new EventEmitter()
  constructor() {
    this.popupData = {
      title:"",
      type: '',
      otherInfo: "",
      show: false
    }
   }

  ngOnInit() {}

  click(e, action) {
    e.stopPropagation()
    setTimeout(() => {
      this.clicked.emit(action)
    }, 200);
  }

  close(e) {
    e.stopPropagation()
    this.clicked.emit("no")
  }
}
