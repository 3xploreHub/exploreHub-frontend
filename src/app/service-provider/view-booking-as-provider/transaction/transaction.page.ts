import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainServicesService } from '../../provider-services/main-services.service';
import { conversation } from '../../transaction/transaction.page';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {
  public message: string;
  public bookingId: string;
  public pageId: string;
  public tourist: string;
  public conversation: conversation;
  public messages: any[] = []
  constructor(public route: ActivatedRoute, public mainService: MainServicesService) { }

  ngOnInit() {
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
          }
        )
      }
    })

    this.mainService.notification.subscribe(
      (data:any) => {
        if (data.type == "message-booking" && this.bookingId == data.bookingId) {
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

  send() {
    if (this.message) {
      if (!this.conversation) {
        const data = { booking: this.bookingId, page: this.pageId, message: this.message, receiver: this.mainService.user._id }
        this.mainService.createConversation(data).subscribe(
          (response: any) => {
            if (!response.noConversation) {
              this.conversation = response
              this.messages = this.conversation.messages
              this.formatData();
              this.mainService.notify({ user: this.mainService.user,bookingId: this.bookingId, conversation: this.conversation, type: "message-booking", receiver: this.tourist, message: `You have new message` })
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
            this.mainService.notify({ user: this.mainService.user,bookingId: this.bookingId, conversationId: this.conversation._id, newMessage: this.messages[this.messages.length - 1], type: "message-booking", receiver: this.tourist, message: `You have new message` })
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
