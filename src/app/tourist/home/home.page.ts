
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TouristServicesService } from '../services/tourist-services.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public allTouristSpots=[]

  constructor( private route:Router,private touristService:TouristServicesService)
   {}

  ngOnInit() {
    this.touristSpots()
    
    
  }
  notif(){
    console.log("click");
    
    this.route.navigate(["/tourist/notification"])
  }

  touristSpots(){
    this.touristService.retrieveAllTouristSpotPage().subscribe((data)=>{      
   
      console.log(data);
      
    })
  }
}
