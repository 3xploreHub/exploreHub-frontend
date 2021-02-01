import { TouristServicesService } from './../services/tourist-services.service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-extra-service',
  templateUrl: './extra-service.component.html',
  styleUrls: ['./extra-service.component.scss'],
})
export class ExtraServiceComponent implements OnInit {
  public extraServiceArray = [];

  constructor(private modalCtrl:ModalController, 
    private touristService:TouristServicesService,
    private router:Router) { }

  ngOnInit() {
    this.extraService()
  }

  extraService(){
    this.touristService.retrieveAllTouristSpots().subscribe((data)=>{
      this.extraServiceArray=data[0].components[1].data
      console.log("extra: ",this.extraServiceArray);
      
    })
  }
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true,
    });
    // this.router.navigate(['/tourist/booking-review'])
  }


}
