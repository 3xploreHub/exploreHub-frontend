import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainServicesService } from '../provider-services/main-services.service';

export interface message {
  _id: string;
  withMedia: boolean;
  sender: string;
  senderFullName: string;
  message: any;
  createdAt: string;
  updatedAt: string;
  noSender: boolean
}
export interface conversation {
  _id: string;
  page: any;
  booking: any;
  messages: message[];
  receiver: any;
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
  @ViewChild('messagesCont') private messagesContainer: ElementRef;
  public message: string;
  public bookingId: string;
  public pageId: string;
  public receiver = { owner: "", admin: this.mainService.user.admin }
  public conReceiver: string;
  public screenHeight: number;
  public conversation: conversation;
  public messages: any[] = []
  constructor(public route: ActivatedRoute, public mainService: MainServicesService) { }

  ngOnInit() {
    this.screenHeight = window.innerHeight - 190
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.bookingId = params.bookingId
        this.pageId = params.pageId
        this.receiver = { owner: params.receiverId, admin: this.mainService.user.admin }
        this.conReceiver = this.receiver.admin
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
          setTimeout(() => {
            this.scrollToBottom()
          }, 400)
        }
      }
    )
  }
  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight + 600;
    } catch (err) { }
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
        setTimeout(() => {
          this.scrollToBottom()
        }, 400)

      }
    )
  }


  getConversation(type) {
    this.conReceiver = type
    this.fetchConversation();
  }

  send() {
    if (this.message) {
      const notificationData = {
        receiver: this.conReceiver,
        mainReceiver: this.mainService.user._id,
        page: this.pageId,
        booking: this.bookingId,
        isMessage: true,
        subject: this.bookingId,
        sender: this.mainService.user._id,
        message: `<b>${this.mainService.user.fullName}</b> sent you a message`,
        type: "booking-provider",
      }
      if (!this.conversation) {
        const data = {notificationData: notificationData, booking: this.bookingId, page: this.pageId, receiver: this.conReceiver, message: this.message }
        this.mainService.createConversation(data).subscribe(
          (response: any) => {
            if (!response.noConversation) {
              this.conversation = response
              this.messages = this.conversation.messages
              this.formatData();
              this.scrollToBottom()
              this.mainService.notify({ user: this.mainService.user, bookingId: this.bookingId, conversation: this.conversation, type: "message-booking", receiver: [this.conReceiver], message: `${this.mainService.user.fullName} sent you a message` })
            }
          }
        )
      } else {
        const forAdmin = this.conversation.receiver == this.mainService.user.admin
        const data = {notificationData:notificationData, forAdmin: forAdmin, conversationId: this.conversation._id, message: this.message }
      const message = { createdAt: "Sending...", sender: this.mainService.user._id, noSender: true, message: this.message }
        this.messages.push(message)
        setTimeout(() => {
          this.scrollToBottom()
        }, 200)
        this.mainService.sendMessage(data).subscribe(
          (response: conversation) => {
            this.conversation = response
            this.messages = this.conversation.messages
            this.formatData()
            this.scrollToBottom()
            this.mainService.notify({ user: this.mainService.user, bookingId: this.bookingId, conversationId: this.conversation._id, newMessage: this.messages[this.messages.length - 1], type: "message-booking", receiver: [this.conReceiver], message: `${this.mainService.user.fullName} sent you a message` })
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
    }
  }

}
