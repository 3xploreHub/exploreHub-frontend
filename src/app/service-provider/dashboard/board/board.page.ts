import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
})
export class BoardPage implements OnInit {
  public clickedTab: string = 'Booked'
  public boxPosition: number;
  constructor(public router: Router) { }

  ngOnInit() {
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
