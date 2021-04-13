import { Component, Input, OnInit } from '@angular/core';

export interface message {
  _id: string;
  sender: string;
  senderFullName: string;
  message: string;
  createdAt: any;
  updatedAt: any;
}
@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss'],
})


export class MessageBoxComponent implements OnInit {
  @Input() position: string = "left";
  @Input() message: any = {
    _id: "", sender: "", senderFullName: "", message: "", createdAt: null, updatedAt: null
  }
  constructor() {
    
   }

  ngOnInit() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Oct", "Sep", "Nov", "Dec"];
    const date = new Date(this.message.createdAt)
    this.message.createdAt = `${months[date.getMonth()]}  ${date.getUTCDate()}, ${date.getUTCFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
  }

}
