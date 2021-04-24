import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainServicesService } from '../../provider-services/main-services.service';
import { conversation } from '../../transaction/transaction.page';

@Component({
  selector: 'app-conversation-card',
  templateUrl: './conversation-card.component.html',
  styleUrls: ['./conversation-card.component.scss'],
})
export class ConversationCardComponent implements OnInit {
  @Input() conversation: conversation;
  public name:string;
  public receiver: string;
  public receiverName: string;
  public lastMessage: string = ""
  constructor(private router: Router, public mainService: MainServicesService) {
    this.conversation = {
      _id: "",
      page: null,
      booking: null,
      messages: [],
      createdAt: "",
      updatedAt: "",
      opened: false,
      receiver: null,
    }
  }

  ngOnInit() { 
    this.getName()
    this.getLastMessage()
  }

  getName() {
    if (this.conversation) {
      if (this.conversation["participants"]) {
        let receiver = this.conversation["participants"].filter(par => par._id != this.mainService.user._id)
        console.log(receiver, "reciver")
        if (receiver.length > 0) {
          this.receiver = receiver[0]._id
          this.receiverName = receiver[0].fullName
          console.log(this.receiverName, this.receiver);
          
        }
      } else {
        this.name = this.conversation.receiver ? this.conversation.receiver.fullName :  this.conversation["type"] == "admin_approval"? "Admin": "Unknown"
      }
    }
  }

  getLastMessage() {
    if (this.conversation.messages.length > 0) {
      let message = this.conversation.messages.reverse()[0].message
      this.lastMessage = message.length > 25? message.substring(0,25)+ "...": message
    }
  }

  openConvo(e) {
    e.stopPropagation()
    setTimeout(() => {
      this.router.navigate(['/service-provider/page-chat'], {queryParams: {receiverName: this.receiverName, receiver: this.receiver, pageId: this.conversation.page, conversationId:this.conversation._id}})
    }, 200);
  }
  clickOption(e) {
    e.stopPropagation()
  }
}
