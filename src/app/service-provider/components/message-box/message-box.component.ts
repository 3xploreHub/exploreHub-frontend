import { Component, Input, OnInit } from '@angular/core';
import { message } from '../../transaction/transaction.page';


@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss'],
})


export class MessageBoxComponent implements OnInit {
  @Input() position: string = "left";
  showDate = false;
  @Input() message: message = {
    _id: "", sender: "", senderFullName: "", message: "", createdAt: null, updatedAt: null,noSender: false}
  constructor() {

   }

  ngOnInit() {
    
  }

}
