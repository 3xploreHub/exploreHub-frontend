import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainServicesService } from '../../provider-services/main-services.service';
import { conversation } from '../../transaction/transaction.page';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {
  @ViewChild('messagesCont') private messagesContainer: ElementRef;
  public screenHeight: number;
  public message: string;
  public bookingId: string;
  public pageId: string;
  public tourist: string;
  public conversation: conversation;
  public messages: any[] = []
  constructor(public route: ActivatedRoute, public mainService: MainServicesService) { }

  

  ngOnInit() {
    this.screenHeight = window.innerHeight - 190
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.bookingId = params.bookingId
        this.pageId = params.pageId
        this.tourist = params.tourist
        this.mainService.getConversation(this.bookingId, this.pageId, this.mainService.user._id).subscribe(
          (response: any) => {
            if (!response.noConversation) {
              this.conversation = response
              this.messages = this.conversation.messages
              this.formatData()
            }
            setTimeout(() => {
              this.scrollToBottom()
            }, 400)
          }
        )
      }
    })

    this.mainService.notification.subscribe(
      (data: any) => {
        if (data.type == "message-booking" && this.bookingId == data.bookingId) {
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

  send() {
    if (this.message) {
      const notificationData = {
        receiver:  this.tourist,
        mainReceiver: this.tourist,
        page: this.pageId,
        booking: this.bookingId,
        isMessage: true,
        sender: this.mainService.user._id,
        subject: this.bookingId,
        message: `<b>${this.mainService.user.fullName}</b> sent you a message`,
        type: "booking-tourist",
      }
      if (!this.conversation) {
        const data = {notificationData:notificationData, booking: this.bookingId, page: this.pageId, message: this.message, receiver: this.mainService.user._id }
        this.mainService.createConversation(data).subscribe(
          (response: any) => {
            if (!response.noConversation) {
              this.conversation = response
              this.messages = this.conversation.messages
              this.formatData();
              this.scrollToBottom()
              this.mainService.notify({ user: this.mainService.user, bookingId: this.bookingId, conversation: this.conversation, type: "message-booking", receiver: [this.tourist], message: `You have new message` })
            }
          }
        )
      } else {
        const data = {notificationData:notificationData, conversationId: this.conversation._id, message: this.message }
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
            this.mainService.notify({ user: this.mainService.user, bookingId: this.bookingId, conversationId: this.conversation._id, newMessage: this.messages[this.messages.length - 1], type: "message-booking", receiver: [this.tourist], message: `You have new message` })
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
