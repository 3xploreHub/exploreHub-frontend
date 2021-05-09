import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { MainServicesService } from '../../provider-services/main-services.service';
import { WeatherComponent } from 'src/app/modules/common-components/weather/weather.component';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {
  @Input() notificationsCount: number;
  @Input() categories: any[];
  @Input() currentCategory: string;
  @Output() changeCategory: EventEmitter<any> = new EventEmitter();
  public pages: Page[] =[]
  weatherToday = {
    icon: null,
    temp: null,
    weather: null,
  }

  constructor(public mainService:MainServicesService, public router: Router, public modalCtrl: ModalController) { }

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

  retrieveTouristSpotByCategory(category) {
    this.currentCategory = category
    this.router.navigate(["/service-provider/online-pages-list"], {queryParams: {category: category}})
  }

  
}
