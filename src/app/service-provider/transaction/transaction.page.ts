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
  noSender: boolean
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
            if (!response.noConversation) {
              this.conversation = response
              this.messages = this.conversation.messages
              this.formatData()
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
          if (!response.noConversation) {
            this.conversation = response
            this.messages = this.conversation.messages
            this.message = ""
          }
        }
      )
    } else {
      const data = { conversationId: this.conversation._id, message: this.message }
      const message = { createdAt: "Sending...", sender: this.mainService.user._id, noSender: true, message: this.message }
      this.messages.push(message)
      this.mainService.sendMessage(data).subscribe(
        (response: conversation) => {
          this.conversation = response
          this.messages = this.conversation.messages
          this.formatData()
        }
      )
    }
    this.message = ""
  }

  formatData() {
    for (let i = 0; i < this.messages.length; ++i) {
      if (i != 0  && this.messages[i - 1].sender == this.messages[i].sender) {
        this.messages[i]["noSender"] = true
      }
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Oct", "Sep", "Nov", "Dec"];
      const date = new Date(this.messages[i].createdAt)
      this.messages[i].createdAt = `${months[date.getMonth()]}  ${date.getUTCDate()}, ${date.getUTCFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
    }
  }

}
