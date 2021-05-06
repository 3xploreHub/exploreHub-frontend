import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MainServicesService } from '../../provider-services/main-services.service';
import { message } from '../../transaction/transaction.page';


@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss'],
})


export class MessageBoxComponent implements OnInit {
  @Input() position: string = "left";
  showDate = false;
  @Input() message: message = {
    _id: "", sender: "", withMedia: false, senderFullName: "", message: "", createdAt: null, updatedAt: null, noSender: false
  }
  constructor(public mainService: MainServicesService, private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit() {
    if (this.message.withMedia || this.message.message.includes("<div data-page=")) {
      this.message.withMedia = true
      this.message.message = this.sanitizer.bypassSecurityTrustHtml(this.message.message)
    }
  }



}