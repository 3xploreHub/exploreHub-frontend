import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { AuthService } from 'src/app/services/auth-services/auth-service.service';
import { MainServicesService } from '../provider-services/main-services.service';

@Component({
  selector: 'app-page-list-card',
  templateUrl: './page-list-card.component.html',
  styleUrls: ['../list-of-pages/list-of-pages.page.scss'],
})
export class PageListCardComponent implements OnInit {
  @Input() page: Page;
  @Output() viewPage: EventEmitter<any> = new EventEmitter();
  @Output() clickOption: EventEmitter<any> = new EventEmitter();
  @Input() searchResult: boolean;
  constructor(public router: Router, public mainService: MainServicesService, public authService: AuthService) { }

  ngOnInit() { }


  view(page) {
   this.viewPage.emit(page)
  }

  clickOpt(e, id) {
    e.stopPropagation()
    setTimeout(() => {
      this.clickOption.emit(id)
    }, 200);
  }

  getStatus(page) {
    const status = page.status;
    return {
      'onlineBg': status == 'Online',
      'pendingBg': status == 'Pending',
      'unfinishedBg': status == 'Unfinished',
      'processingBg': status == 'Processing',
      'notOperatingBg': status == "Not Operating",
      'rejectedBg': status == 'Rejected' || status == 'Cancelled'
    }
  }
}
