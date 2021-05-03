import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainServicesService } from '../provider-services/main-services.service';
import { conversation } from '../transaction/transaction.page';

@Component({
  selector: 'app-page-conversations',
  templateUrl: './page-conversations.page.html',
  styleUrls: ['./page-conversations.page.scss'],
})
export class PageConversationsPage implements OnInit {
  public pageId: string;
  loading = true
  public conversations: any[] = []
  constructor(private mainService: MainServicesService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params) {
          this.pageId = params.pageId
          this.mainService.getAllConversations(this.pageId).subscribe(
            (data: any) => {
              this.loading = false
              this.conversations = data;
            }
          )
        }
      }
    )

  }

}
