import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-online-pages-list',
  templateUrl: './online-pages-list.page.html',
  styleUrls: ['./online-pages-list.page.scss'],
})
export class OnlinePagesListPage implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

  viewPage(pageId) {
    this.router.navigate(['/service-provider/view-page', pageId])
  }
}
