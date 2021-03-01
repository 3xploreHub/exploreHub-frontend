import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-page-input-field-list',
  templateUrl: './page-input-field-list.component.html',
  styleUrls: ['./page-input-field-list.component.scss'],
})
export class PageInputFieldListComponent implements OnInit {
  public selectedComponentName: string;
  isInItemList: boolean;

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
