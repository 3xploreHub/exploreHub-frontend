import { Component, OnInit } from "@angular/core";
import { TouristSpotPage } from "src/app/modules/interfaces/tourist-spot-page";
import { SelectHostTouristSpotService } from "./select-host-tourist-spot.service";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Spot {
  id: number;
  category_id: number;
  category_name: string;
  name: string;
  description: string;
  image: string;
  location: string;
  selected: boolean;
}

interface SpotCategory {
  _id: string;
  name: string;
  touristSpotTotalCount: number;
}

@Component({
  selector: "app-select-host-tourist-spot",
  templateUrl: "./select-host-tourist-spot.page.html",
  styleUrls: ["./select-host-tourist-spot.page.scss"],
})

export class SelectHostTouristSpotPage implements OnInit {
 
  keyupValues = "";

  sampleCategory;

  spots: Spot[] = [
    {
      id: 1,
      category_id: 1,
      category_name: "kawasan falls",
      name: "Oslob whale shark watching and diving",
      description:
        "Lorem ipsum dolor sit amet consecteturadipisicingelit.Illum, deleniti?Lorem ipsumdolor sitamet consectetur adipisicing elit. Illum, deleniti?Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, deleniti?Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, deleniti? ",
      image: "assets/images/host-tourist-spot.jpg",
      location: "Oslob Cebu",
      selected: false,
    },
    {
      id: 2,
      category_id: 3,
      category_name: "kawasan falls",
      name: "Osmena Peak Hiking",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, deleniti?",
      image: "assets/images/host-tourist-spot.jpg",
      location: "Mantalongon Dalaguete Cebu",
      selected: false,
    },
    {
      id: 3,
      category_id: 4,
      category_name: "kawasan falls",
      name: "Kawasan Falls Badian Cebu Island Hopping In the Center of the cebu",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, deleniti?",
      image: "assets/images/badian-canyoneering.jpg",
      location: "Matotinao Badian Cebu",
      selected: false,
    },
    {
      id: 4,
      category_id: 4,
      category_name: "kawasan falls",
      name: "Canyoneering Alegria",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, deleniti?",
      image: "../../../assets/images/host-tourist-spot.jpg",
      location: "Compostela, Alegria, Cebu",
      selected: false,
    },
    {
      id: 4,
      category_id: 4,
      category_name: "kawasan falls",
      name: "Cambais Alegria",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, delenitidsasda?",
      image: "../../../assets/images/host-tourist-spot.jpg",
      location: "Compostela, Alegria, Cebu",
      selected: false,
    },
    {
      id: 4,
      category_id: 4,
      category_name: "kawasan falls",
      name: "Ligo Alegria",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, delenitifdshafklfdashlfdadflks?",
      image: "../../../assets/images/host-tourist-spot.jpg",
      location: "Compostela, Alegria, Cebu",
      selected: false,
    },
    {
      id: 4,
      category_id: 4,
      category_name: "kawasan falls",
      name: "Canyo Alegria",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, delenitidasdasdadasadsaqs?",
      image: "../../../assets/images/host-tourist-spot.jpg",
      location: "Compostela, Alegria, Cebu",
      selected: false,
    },
  ];

  constructor(
    private router: Router,
    private selectHostTouristSpotService: SelectHostTouristSpotService
  ) {}

  spotsListCategory: Spot[] = [];
  selectedSpots: Spot[] = [];
  yourHostSpot: Spot;
  spotsLocation = [];
  allSpotsName = [];
  show = false;
  buttonSelectWord = "Select";
  searchInput: string;
  
  ngOnInit() {
    this.getAllSpotsLocation();
    this.getAllSpotNames();

    this.getAllTouristSpot();
    this.retreiveAllTouristSpotCategory();
  }

  onKey(event: any) { // without type info
    this.keyupValues += event.target.value + ' | ';
    console.log(this.keyupValues)
  }

  retreiveAllTouristSpotCategory() {
    return this.selectHostTouristSpotService
      .retreiveAllTouristSpotCategories()
      .subscribe((categories) => {
          console.log("Categories: " +  categories)
          this.sampleCategory = categories;
          console.log("Sample Category: " + JSON.stringify(this.sampleCategory))
      });
  }

  getAllTouristSpot() {
    for(var i = 0; i<this.spots.length; i++) {
      this.spotsListCategory.push(this.spots[i]);
    }
  }

  displayListOfSpotsInCategory(category: SpotCategory) {
    for (var i = 0; i < this.spots.length; i++) {
      if (this.spots[i].category_name == category.name) {
        this.spotsListCategory.push(this.spots[i]);
      }
    }
    console.log("Category Selected: " , JSON.stringify(category))
  }

  showDetails(spot: Spot) {
    this.yourHostSpot = spot;
    // this.hostSpotName = spot.name.toUpperCase();
    this.show = true;
    console.log("Selected Spot: ", this.selectedSpots)

    //set the style of the details container to show in the page
    // console.log("Show details spot: " + spot)
  }

  closeSpotDetails() {
    this.show = false;
  }

  selectTouristSpot() {
    console.log("Before Selected Spot: ", this.selectedSpots)
    this.selectedSpots = [];
    if(!this.selectedSpots.includes(this.yourHostSpot)) {
      this.selectedSpots.push(this.yourHostSpot);
      console.log("Sseeeeeeeeeeee", this.selectedSpots)
    }else{
      console.log("Spot is already selected: ", this.selectedSpots)
    }
      this.show = false;
  }

  submitSelectedHostSpot() {
    console.log("Selected Host Spot: " + JSON.stringify(this.selectedSpots));
    this.router.navigate(["/service-provider/select-host-tourist-spot"]);
  }

  cancelSelectedHostSpot() {
    this.selectedSpots = [];
  }

  getAllSpotsLocation() {
    for (var i = 0; i < this.spots.length; i++) {
      const location = this.spots[i].location.toLowerCase();
      if (this.spotsLocation.indexOf(location) !== -1) {
        continue;
      }
      this.spotsLocation.push(location);
    }
    console.log("Spot Location", this.spotsLocation);
  }

  getAllSpotsBasedOnSearch() {}

  

 

  getAllSpotNames() {
    // this.spotsListCategory = [];
    for (var i = 0; i < this.spots.length; i++) {
      this.allSpotsName.push(this.spots[i].name.toLowerCase());
    }
    console.log("All Spots' Name: " + this.allSpotsName);
  }

  getAllSpotBasedOnSearchInput() {
    this.spotsListCategory = [];
    for (var i = 0; i < this.allSpotsName.length; i++) {
      for (var j = 0; j < this.spots.length; j++) {
        if (this.allSpotsName[i] === this.spots[j].name.toLowerCase()) {
          this.spotsListCategory.push(this.spots[j]);
        }
      }
    }
  }
}
