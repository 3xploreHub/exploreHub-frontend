import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit, AfterViewInit, ViewWillEnter {
  @ViewChild('tab', { read: ViewContainerRef }) tab: ViewContainerRef;
  public clickedTab: string = 'Booked'
  public boxPosition: number;
  public height: any = window.innerHeight - 124;

  constructor(public router: Router, public mainService: MainServicesService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.init()
  }

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
    const width = div.clientWidth;
    this.clickedTab  = tab
    if (url) {
      const currentPage = this.mainService.currentPage
      const route = ["/service-provider/dashboard/" + currentPage.pageType + "/" + currentPage._id + "/board/" + url[0]]
      if (url.length > 1) route.push(url[1])
      this.router.navigate(route)
    }
    switch (tab) {
      case 'Booked':
        this.boxPosition = 0;
        break;
      case 'Pending':
        this.boxPosition = width;
        break;
      default:
        this.boxPosition = width * 2
        break;
    }
  }
}

