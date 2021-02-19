

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TouristServicesService } from '../services/tourist-services.service';
export interface touristSpot {
  _id: string;
  image: string;
  name: string;
  location: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})


export class HomePage implements OnInit {
  public touristSpotList: touristSpot[] = [];


  constructor(private route: Router, private touristService: TouristServicesService) { }

  ngOnInit() {
    this.touristSpots()
  }
  notif() {
    console.log("click");

    this.route.navigate(["/tourist/notification"])
  }

  touristSpots() {
    this.touristService.retrieveAllTouristSpotPage().subscribe((data) => {
      // console.log("data: ",data)
      // data[0].components[0].data.push({ url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvVEar6kOEyRzcdOFlxULS1aZNmvnYqEUzrg&usqp=CAU" })
      // data[0].components[1].data["text"] = "this is the title here"
      // data[0].components[2].data["text"] = "this is the location here"
      data.forEach(element => { 
        const elem = element.components;
        let touristspotpage: touristSpot = {
          _id: element._id,
          image: elem[0].data.length? elem[0].data[0].url: "no url" ,
          name: elem[1].data.text? elem[1].data.text: "no name",
          location: elem[2].data.text? elem[2].data.text: "no location"
        }
        this.touristSpotList.push(touristspotpage)
      })
    })
    console.log("spots: ",this.touristSpotList)
  }

}
