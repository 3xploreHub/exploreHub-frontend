import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-page-services-list',
  templateUrl: './page-services-list.component.html',
  styleUrls: ['./page-services-list.component.scss'],
})
export class PageServicesListComponent implements OnInit {
  public selectedComponentName: string;

  constructor(public modalController: ModalController) { }

  ngOnInit() { }

  async dismiss() {
    this.modalController.dismiss(this.selectedComponentName);
  }

  addComponent(name) {
    this.selectedComponentName = name;
    this.dismiss();
  }
}
