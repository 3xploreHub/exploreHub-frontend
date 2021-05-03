import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements AfterViewInit {
  @ViewChild('tab', { read: ViewContainerRef }) tab: ViewContainerRef;
  public clickedTab: string = 'Booked'
  public boxPosition: number;
  public height: any = window.innerHeight - 124;

  constructor(public router: Router, public mainService: MainServicesService) { }

  ngAfterViewInit() {
    this.init()
  }


  init() {
    setTimeout(() => {
      const url = this.router.url.split('/').reverse();
      const path = url[0];
      let currentTab = path[0].toUpperCase() + path.substring(1);
      currentTab = currentTab.includes("?") ? currentTab.split("?")[0] : currentTab;
      if (this.tab) {
        this.goToSection(currentTab, this.tab.element.nativeElement);
      }
    }, 500);
  }

  goToSection(tab: string, div: HTMLElement, url = null) {
    const width = 110
    this.clickedTab = tab
    if (url) {
      const currentPage = this.mainService.currentPage
      const route = ["/service-provider/dashboard/" + currentPage.pageType + "/" + currentPage._id + "/board/" + url[0]]
      if (url.length > 1) route.push(url[1])
      this.router.navigate(route)
    }
    switch (tab) {
      case 'Closed':
        this.boxPosition = -width;
        break;
      case 'Booked':
        this.boxPosition = 0;
        break;
      case 'Processing':
        this.boxPosition = width;
        break;
      case 'Pending':
        this.boxPosition = width * 2;
        break;
      case 'Cancelled':
        this.boxPosition = width * 3;
        break;
      default:
        this.boxPosition = width * 4
        break;
    }
  }
}

