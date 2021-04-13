import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainServicesService } from '../provider-services/main-services.service';

export interface message {
  _id: string;
  sender: string;
  senderFullName: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}
export interface conversation {
  _id: string;
  page: any;
  booking: any;
  messages: message[];
  createdAt: string;
  updatedAt: string;
  opened: boolean;
}

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {
  public message: string;
  public bookingId: string;
  public pageId: string;
  public conversation: conversation;
  public messages: any[] = []
  constructor(public route: ActivatedRoute, public mainService: MainServicesService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.bookingId = params.bookingId
        this.pageId = params.pageId
        this.mainService.getConversation(this.bookingId, this.pageId).subscribe(
          (response: any) => {
            if(!response.noConversation) {
              this.conversation = response
              this.messages = this.conversation.messages
            } 
          }
        )
      }
    })
  }

  send() {
    if (!this.conversation) {
      const data = { booking: this.bookingId, page: this.pageId, message: this.message }
      this.mainService.createConversation(data).subscribe(
        (response: any) => {
          if(!response.noConversation) {
            this.conversation = response
            this.messages = this.conversation.messages
          } 
        }
      )
    } else {
      const data = { conversationId: this.conversation._id, message: this.message }
      this.mainService.sendMessage(data).subscribe(
        (response: message) => {
          this.conversation.messages.push(response);
        }
      )
    }
  }

}
