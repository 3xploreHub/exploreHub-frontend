import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { conversation } from '../../transaction/transaction.page';

@Component({
  selector: 'app-conversation-card',
  templateUrl: './conversation-card.component.html',
  styleUrls: ['./conversation-card.component.scss'],
})
export class ConversationCardComponent implements OnInit {
  @Input() conversation: conversation;
  constructor(private router: Router) {
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

  ngOnInit() { }


  getLastMessage() {
    
    if (this.conversation.messages.length > 0) {
      return this.conversation.messages.reverse()[0].message

    }
    return "--------------"
  }

  openConvo(e) {
    e.stopPropagation()
    setTimeout(() => {
      this.router.navigate(['/service-provider/page-chat'], {queryParams: {receiverName: this.conversation.receiver.fullName ,type: "page_conversation", conversationId:this.conversation._id}})
    }, 200);
  }
  clickOption(e) {
    e.stopPropagation()
  }
}
