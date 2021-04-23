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
  public receiverName: string;
  public type: string;
  public receiver: string;
  public notifType = {host_page_creator_approval: "page-provider", admin_approval: "page-admin", tourist_message: "page-tourist"}
  public conversation: conversation;
  public messages: any[] = []
  constructor(public route: ActivatedRoute, public mainService: MainServicesService) { }

  ngOnInit() {
    this.screenHeight = window.innerHeight - 120
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.pageId = params.pageId
        this.type = params.type;
        if (this.type == "host_page_creator_approval") {
          this.receiverName = params.pageName
          this.receiver = params.receiver
          this.conversationId = params.conversationId
          this.mainService.getConvoForPageSubmission(this.pageId, this.type).subscribe(
            (response: any) => {
              if (!response.noConversation) {
                this.conversation = response
                this.type = this.conversation["type"]
                this.messages = this.conversation.messages
                this.receiver =  this.conversation.page.creator
                this.receiverName =  this.receiverName = this.conversation.receiver.fullName ? this.conversation.receiver.fullName : this.conversation.receiver.username  == "admin"? "Admin": "Unknown"
                this.formatData()
              }
              setTimeout(() => {
                this.scrollToBottom()
              }, 400)
            }
          )
        } else {
          this.receiverName = params.receiverName
          this.conversationId = params.conversationId
          this.mainService.getPageConversation(this.conversationId).subscribe(
            (response: any) => {
              if (!response.noConversation) {
                this.conversation = response
                this.pageId = this.conversation.page._id
                this.type = this.conversation["type"]
                this.receiverName = this.conversation.receiver.fullName ? this.conversation.receiver.fullName : this.conversation.receiver.username  == "admin"? "Admin": "Unknown"
                this.messages = this.conversation.messages
                this.receiver = this.conversation.receiver == this.mainService.user._id? this.conversation.page.creator: this.conversation.receiver._id
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

     this.mainService.notification.subscribe(
      (data: any) => {
        if (data.type == "message-page" && this.pageId == data.pageId) {
          if (this.conversation && data.conversationId != this.conversation._id) return;
          if (data.conversation) {
            this.conversation = data.conversation
            this.messages = this.conversation.messages
            this.formatData()
          } else {
            const message = this.messages.filter(m => m._id == data.newMessage._id)
            if (message.length == 0) this.messages.push(data.newMessage);
            this.formatData()
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
        receiver:  this.receiver,
        mainReceiver: this.mainService.user._id,
        page: this.pageId,
        booking: null,
        isMessage: true,
        sender: this.mainService.user._id,
        subject: this.pageId,
        message: `${this.mainService.user.fullName} sent you a message`,
        type: this.notifType[this.type],
      }
      if (!this.conversation) {
        const data = { notificationData: notificationData, booking: null, page: this.pageId, message: this.message, type: "host_page_creator_approval", receiver: this.mainService.user._id }
        this.mainService.createConvoForPageSubmission(data).subscribe(
          (response: any) => {
            if (!response.noConversation) {
              this.conversation = response
              this.messages = this.conversation.messages
              this.formatData();
              this.scrollToBottom()
              this.mainService.notify({ user: this.mainService.user, pageId: this.pageId, conversation: this.conversation, type: "message-page", receiver: [this.receiver], message:  `${this.mainService.user.fullName} sent you a message` })
            }
          }
        )
      } else {
        const data = { notificationData: notificationData, conversationId: this.conversation._id, message: this.message }
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
            this.mainService.notify({ user: this.mainService.user, pageId: this.pageId, conversationId: this.conversation._id, newMessage: this.messages[this.messages.length - 1], type: "message-page", receiver: [this.receiver], message:  `${this.mainService.user.fullName} sent you a message` })
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
