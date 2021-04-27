import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {
  @Input() notificationsCount: number;
  constructor(public mainService:MainServicesService, public router: Router) { }

  ngOnInit() {
    
  }

  goTo(path, fromHome) {
    setTimeout(() => {
      const params = fromHome? {queryParams: {formDashboard: true}}: {}
      this.router.navigate(path, params)
    }, 300);
  }

  getNotificationCount() {
    this.mainService.getNotificationsCount().subscribe(
      (response: any) => {
        this.notificationsCount = response
      }
    )
  }

}
