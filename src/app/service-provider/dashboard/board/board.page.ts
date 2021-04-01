import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { MainServicesService } from '../../provider-services/main-services.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit, AfterViewInit {
  @ViewChild('tab', { read: ViewContainerRef }) tab: ViewContainerRef;
  public clickedTab: string = 'Booked'
  public boxPosition: number;
  public height: any = window.innerHeight - 124;

  constructor(public router: Router, public mainService: MainServicesService) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    setTimeout(() => {
      const url = this.router.url.split('/');
      const path = url[url.length - 1];
      let currentTab = path[0].toUpperCase() + path.substring(1);

      currentTab = currentTab.includes("?") ? currentTab.split("?")[0] : currentTab;

      if (this.tab) {
        this.goToSection(currentTab, this.tab.element.nativeElement);
      }
    }, 500);
  }

  goToSection(tab: string, div: HTMLElement) {
    this.clickedTab = tab;
    const width = div.clientWidth;
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
  
