import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-select-location-municipality",
  templateUrl: "./select-location-municipality.page.html",
  styleUrls: ["./select-location-municipality.page.scss"],
})
export class SelectLocationMunicipalityPage implements OnInit {
  sampleSpotLocation = [
    {
      id: 1,
      name: "Dalaguete",
    },
    {
      id: 2,
      name: "Badian",
    },
    {
      id: 3,
      name: "Moalboal",
    },
    {
      id: 4,
      name: "Alegria",
    },
    {
      id: 5,
      name: "Oslob",
    },
    {
      id: 6,
      name: "Bantayan",
    },
    {
      id : 7,
      name : "Alcoy",
    },
    {
      id: 8, 
      name: "Boljoon",
    },
    {
      id : 9,
      name : "Alcoy",
    },{
      id : 10,
      name : "Alcoy",
    },{
      id : 11,
      name : "Alcoy",
    },
  ];

  // @Output 

  constructor(private router: Router) {}

  ngOnInit() {}

  selectLocation(location) {
    //select specific location where the service provider wants to offer his/her service

    //emit location
    this.router.navigate(["/service-provider/select-host-tourist-spot"]);
    console.log("Selected Spot Location: " + JSON.stringify(location))
  }

  getAllSpotLocations() {
    //call the service which returns all the different spots' location
  }
}
