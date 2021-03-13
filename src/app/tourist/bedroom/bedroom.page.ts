import { Component, OnInit, Input } from '@angular/core';
import { TouristServicesService } from '../services/tourist-services.service';
import { ModalController } from '@ionic/angular';
import {ExtraServiceComponent} from '../extra-service/extra-service.component'

@Component({
  selector: 'app-bedroom',
  templateUrl: './bedroom.page.html',
  styleUrls: ['./bedroom.page.scss'],
})
export class BedroomPage implements OnInit {
  public bedroomArray=[];

  constructor( public modalController: ModalController,private touristService:TouristServicesService) { }

  ngOnInit() {
 
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: ExtraServiceComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  

}
