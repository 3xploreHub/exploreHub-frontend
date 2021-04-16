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

export enum receiver {
  owner = "owner",
  admin = "admin"
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
  public receiver = { owner: "", admin: "606eefbcfcfdc21c7c793bb0" }
  public conReceiver: string;
  public conversation: conversation;
  public messages: any[] = []
  constructor(public route: ActivatedRoute, public mainService: MainServicesService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.bookingId = params.bookingId
        this.pageId = params.pageId
        this.receiver = { owner: params.receiverId, admin: '606eefbcfcfdc21c7c793bb0' }
        this.conReceiver = this.receiver.owner
        this.fetchConversation()
      }
    })

    this.mainService.notification.subscribe(
      (data: any) => {
        if (data.type == "message-booking" && this.bookingId == data.bookingId && this.conReceiver == data.user._id) {
          if (data.conversation) {
            this.conversation = data.conversation
            this.messages = this.conversation.messages
          this.formatData()
          } else {
            const message = this.messages.filter(m => m._id == data.newMessage._id)
            if (message.length == 0) this.messages.push(data.newMessage);
          }
        }
      }
    )

  }

  fetchConversation() {
    this.mainService.getConversation(this.bookingId, this.pageId, this.conReceiver).subscribe(
      (response: any) => {
        if (!response.noConversation) {
          this.conversation = response
          this.messages = this.conversation.messages
          this.formatData()
        } else {
          this.conversation = null
          this.messages = []
        }
      }
    )
  }


  getConversation() {
    this.conReceiver = this.conReceiver == this.receiver.owner ? this.receiver.admin : this.receiver.owner
    this.fetchConversation();
  }

  send() {
    if (this.message) {
      if (!this.conversation) {
        const data = { booking: this.bookingId, page: this.pageId, receiver: this.conReceiver, message: this.message }
        this.mainService.createConversation(data).subscribe(
          (response: any) => {
            if (!response.noConversation) {
              this.conversation = response
              this.messages = this.conversation.messages
              this.formatData();
              this.mainService.notify({ user: this.mainService.user, bookingId: this.bookingId, conversation: this.conversation, type: "message-booking", receiver: this.conReceiver, message: `${this.mainService.user.fullName} sent you a message` })
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
            this.mainService.notify({ user: this.mainService.user, bookingId: this.bookingId, conversationId: this.conversation._id, newMessage: this.messages[this.messages.length - 1], type: "message-booking", receiver: this.conReceiver, message: `${this.mainService.user.fullName} sent you a message` })
          }
        )
      }

      this.message = ""
    }

  }
  formatData() {
    for (let i = 0; i < this.messages.length; ++i) {
      if (i != 0 && this.messages[i - 1].sender == this.messages[i].sender) {
        this.messages[i]["noSender"] = true
      }
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Oct", "Sep", "Nov", "Dec"];
      const date = new Date(this.messages[i].createdAt)
      this.messages[i].createdAt = `${months[date.getMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}, ${date.getHours()}:${date.getMinutes()}`;
    }
  }

}
