import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainServicesService } from '../provider-services/main-services.service';
import { conversation } from '../transaction/transaction.page';

@Component({
  selector: 'app-page-chat',
  templateUrl: './page-chat.page.html',
  styleUrls: ['./page-chat.page.scss'],
})
export class PageChatPage implements OnInit {
  @ViewChild('messagesCont') private messagesContainer: ElementRef;
  public screenHeight: number;
  public message: string;
  public pageId: string;
  public conversationId: string;
  public receiver: string;
  public conversation: conversation;
  public messages: any[] = []
  constructor(public route: ActivatedRoute, public mainService: MainServicesService) { }

  ngOnInit() {
    this.screenHeight = window.innerHeight - 120
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.pageId = params.pageId
        if (params.type == "host_page_creator_approval") {
          this.receiver = params.pageName
          this.conversationId = params.conversationId
          this.mainService.getConvoForPageSubmission(this.pageId, "host_page_creator_approval").subscribe(
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
        } else {
          this.receiver = params.receiverName
          this.conversationId = params.conversationId
          this.mainService.getPageConversation(this.conversationId).subscribe(
            (response: any) => {
              if (!response.noConversation) {
                this.conversation = response
                this.receiver = this.conversation.receiver ? this.conversation.receiver.fullName : this.conversation["type"] == "admin_approval"? "Admin": "Unknown"
                this.messages = this.conversation.messages
                this.formatData()
              }
              setTimeout(() => {
                this.scrollToBottom()
              }, 400)
            }
          )

        }
      }
    })

    // this.mainService.notification.subscribe(
    //   (data: any) => {
    //     if (data.type == "message-booking" && this.bookingId == data.bookingId) {
    //       if (data.conversation) {
    //         this.conversation = data.conversation
    //         this.messages = this.conversation.messages
    //         this.formatData()
    //       } else {
    //         const message = this.messages.filter(m => m._id == data.newMessage._id)
    //         if (message.length == 0) this.messages.push(data.newMessage);
    //       }
    //       setTimeout(() => {
    //         this.scrollToBottom()
    //       }, 400)
    //     }
    //   }
    // )
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight + 600;
    } catch (err) { }
  }

  send() {
    if (this.message) {
      // const notificationData = {
      //   receiver:  this.receiver,
      //   mainReceiver: this.receiver,
      //   page: this.pageId,
      //   booking: null,
      //   isMessage: true,
      //   sender: this.mainService.user._id,
      //   subject: this.pageId,
      //   message: `${this.mainService.user.fullName} sent you a message`,
      //   type: "booking-tourist",
      // }
      if (!this.conversation) {
        const data = { notificationData: null, booking: null, page: this.pageId, message: this.message, type: "host_page_creator_approval", receiver: this.mainService.user._id }
        this.mainService.createConvoForPageSubmission(data).subscribe(
          (response: any) => {
            if (!response.noConversation) {
              this.conversation = response
              this.messages = this.conversation.messages
              this.formatData();
              this.scrollToBottom()
              // this.mainService.notify({ user: this.mainService.user, bookingId: null, conversation: this.conversation, type: "message-booking", receiver: [this.tourist], message: `You have new message` })
            }
          }
        )
      } else {
        const data = { notificationData: null, conversationId: this.conversation._id, message: this.message }
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
            // this.mainService.notify({ user: this.mainService.user, bookingId: this.bookingId, conversationId: this.conversation._id, newMessage: this.messages[this.messages.length - 1], type: "message-booking", receiver: [this.tourist], message: `You have new message` })
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
