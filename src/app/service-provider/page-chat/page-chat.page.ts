import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MainServicesService } from '../provider-services/main-services.service';
import { conversation } from '../transaction/transaction.page';

@Component({
  selector: 'app-page-chat',
  templateUrl: './page-chat.page.html',
  styleUrls: ['./page-chat.page.scss'],
})
export class PageChatPage implements OnInit, OnDestroy {
  @ViewChild('messagesCont') private messagesContainer: ElementRef;
  public screenHeight: number;
  public message: string;
  public pageId: string;
  public conversationId: string;
  public receiverName: string;
  public report: string = ""
  public type: string;
  public receiver: string;
  public reporting: boolean = false;
  public pageReport: any;
  public inputPlaceholder: string = "Enter message here"
  public pageToReport: string;
  public notifType = { host_page_creator_approval: "page-provider", admin_approval: "page-admin", tourist_message: "page-tourist" }
  public conversation: conversation;
  public messages: any[] = []

  constructor(public route: ActivatedRoute, private sanitizer: DomSanitizer, public mainService: MainServicesService) { }

  ngOnInit() {
    this.screenHeight = window.innerHeight - 120
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.pageId = params.pageId
        this.type = params.type;

        this.receiverName = params.receiverName
        this.receiver = params.receiver
        this.conversationId = params.conversationId
        if (params.pageToReport) {
          this.mainService.getPage(params.pageToReport).subscribe(page => {
            this.report = `<div data-page="${params.pageToReport}" style="width:200px;margin:10px; background-color: white; display:flex; flex-direction: column; align-items: center; justify-content: center">
            <div style="padding:8px 0; background-color: red; color:white;text-align:center;font-size:12px; width: 200px;">Report</div>
              <div  style="width:200px;margin:0; height: 150px; background-color:lightsteelblue; overflow:hidden"><div style="width:100%; height: 100%; background-size: cover;background-position: center; background-image: url('${this.getValue(page, "photo")}');"></div></div>
              <div style="width:200px; color: dodgerblue; padding:8px; font-size:18px; text-align:center">${this.getValue(page, "pageName")}</div>
            </div>`
            this.pageReport = this.sanitizer.bypassSecurityTrustHtml(this.report)
            this.reporting = true;
          })
          this.inputPlaceholder = "Enter your reason here"
        }
        if (this.type == "admin_approval") {
          this.mainService.getConvoForPageSubmission(this.pageId, this.type).subscribe(
            (response: any) => {
              if (!response.noConversation) {
                this.conversation = response
                this.type = this.conversation["type"]
                this.messages = this.conversation.messages

                this.formatData()

              }
              setTimeout(() => {
                this.scrollToBottom()
              }, 400)
            }
          )
        }
        else if (this.type == "host_page_creator_approval") {
          this.mainService.getConvoForPageSubmission(this.pageId, this.type).subscribe(
            (response: any) => {
              if (!response.noConversation) {
                this.conversation = response
                this.type = this.conversation["type"]
                this.messages = this.conversation.messages
                // this.receiver =  this.conversation.page.creator
                // this.receiverName =  this.receiverName = this.conversation.receiver.fullName ? this.conversation.receiver.fullName : this.conversation.receiver.username  == "admin"? "Admin": "Unknown"
                // if (this.receiver == this.mainService.user._id) {
                //   this.receiverName = params.pageName
                // }
                this.formatData()
              }
              setTimeout(() => {
                this.scrollToBottom()
              }, 400)
            }
          )
        } else {
          this.mainService.getPageConversation(this.conversationId).subscribe(
            (response: any) => {
              if (!response.noConversation) {
                this.conversation = response
                this.pageId = this.conversation.page._id
                this.type = this.conversation["type"]
                this.messages = this.conversation.messages
                this.conversation["participants"].forEach(par => {
                  if (par._id != this.mainService.user._id) {
                    this.receiverName = par.fullName
                    this.receiver = par._id
                  }
                });
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

  getValue(page, type) {
    let value;
    page.components.forEach(element => {
      if (type == "photo" && element.type == type) {
        value = element.data[0].url
      } else if (element.data.defaultName == type) {
        value = element.data.text;
      }
    });
    return value;
  }

  ngOnDestroy() {
    if (this.conversation) {

      this.mainService.openConvo(this.conversation._id, true).subscribe(
        (response: any) => {

        }
      )
    }
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight + 600;
    } catch (err) { }
  }

  send() {
    if (this.message) {
      this.message = this.report + this.message

      this.reporting = false;
      const notificationData = {
        receiver: this.receiver,
        mainReceiver: this.mainService.user._id,
        page: this.pageId,
        booking: null,
        isMessage: true,
        sender: this.mainService.user._id,
        subject: this.pageId,
        message: `<b>${this.mainService.user.fullName}</b> sent you a message`,
        type: this.notifType[this.type],
      }
      if (!this.conversation) {
        const data = { notificationData: notificationData, withMedia: this.report ? true : false, booking: null, page: this.pageId, message: this.message, type: this.report? "admin_approval": "host_page_creator_approval", receiver: this.receiver }
        this.mainService.createConvoForPageSubmission(data).subscribe(
          (response: any) => {
            this.report = ""
            if (!response.noConversation) {
              this.inputPlaceholder = "Enter message here"
              this.conversation = response
              this.messages = this.conversation.messages
              this.formatData();
              this.scrollToBottom()
              this.mainService.notify({ user: this.mainService.user, pageId: this.pageId, conversation: this.conversation, type: "message-page", receiver: [this.receiver], message: `${this.mainService.user.fullName} sent you a message` })
            }
          }
        )
      } else {
        const data = { pageConvo: true, notificationData: notificationData, conversationId: this.conversation._id, message: this.message }
        const message = { createdAt: "Sending...", withMedia: this.report ? true : false, sender: this.mainService.user._id, noSender: true, message: this.message }
        this.messages.push(message)
        setTimeout(() => {
          this.scrollToBottom()
        }, 200)
        this.mainService.sendMessage(data).subscribe(
          (response: conversation) => {
            this.inputPlaceholder = "Enter message here"

            this.report = ""
            this.conversation = response
            this.messages = this.conversation.messages
            this.formatData()
            this.scrollToBottom()
            this.mainService.notify({ user: this.mainService.user, pageId: this.pageId, conversationId: this.conversation._id, newMessage: this.messages[this.messages.length - 1], type: "message-page", receiver: [this.receiver], message: `${this.mainService.user.fullName} sent you a message` })
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
