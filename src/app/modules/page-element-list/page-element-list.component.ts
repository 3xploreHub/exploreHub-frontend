import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-page-element-list',
  templateUrl: './page-element-list.component.html',
  styleUrls: ['./page-element-list.component.scss'],
})
export class PageElementListComponent implements OnInit {
  public selectedComponentName: string;
  isInItemList: boolean;
  insideItem: boolean;

  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  async dismiss() {
    this.modalController.dismiss(this.selectedComponentName);
  }

  addComponent(name) {
    this.selectedComponentName = name;
    this.dismiss();
  }
}
