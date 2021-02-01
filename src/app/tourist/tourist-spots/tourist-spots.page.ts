import { Component, OnInit } from '@angular/core';
import { TouristServicesService } from '../services/tourist-services.service';

@Component({
  selector: 'app-tourist-spots',
  templateUrl: './tourist-spots.page.html',
  styleUrls: ['./tourist-spots.page.scss'],
})
export class TouristSpotsPage implements OnInit {
  public rules:boolean = true;
  public selectedSpot=[]

  constructor(private touristService:TouristServicesService) { }
  option = {
    slidesPerView: 1.5,
    centeredSlides: true,
    loop: true,
    spaceBetween: 10,
    // autoplay:true,
  }

  ngOnInit() {
    this.touristSpots()
  }
  hideAndShow(){
    if(this.rules){
      this.rules = false;
    }else{
      this.rules = true;
    }
  }
  touristSpots(){
    this.touristService.retrieveAllTouristSpots().subscribe((data)=>{      
      this.selectedSpot = data[0];
      console.log(this.selectedSpot);
      
    })
  }

}
