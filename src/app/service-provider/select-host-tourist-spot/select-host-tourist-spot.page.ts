import { Component, OnInit } from "@angular/core";
import { TouristSpotPage } from "src/app/modules/interfaces/tourist-spot-page";

interface Spot {
  id: number;
  category_id: number;
  name: string;
  description: string;
  image: string;
  location: string;
  selected: boolean;
}

interface SpotCategory {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: "app-select-host-tourist-spot",
  templateUrl: "./select-host-tourist-spot.page.html",
  styleUrls: ["./select-host-tourist-spot.page.scss"],
})

// interface Spot {
//   id: string;
//   name: string;
//   description: string;
//   image: string;
// }
export class SelectHostTouristSpotPage implements OnInit {
  sampleCategory = [
    {
      id: 1,
      name: "Diving",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, deleniti? ",
    },
    {
      id: 2,
      name: "Horse Back Riding",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, deleniti?",
    },
    {
      id: 3,
      name: "Mountaineering",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, deleniti?",
    },
    {
      id: 4,
      name: "Canyoneering",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, deleniti?",
    },
    {
      id: 5,
      name: "Boat Riding",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, deleniti?",
    },
  ];

  spots: Spot[] = [
    {
      id: 1,
      category_id: 1,
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
      name: "Kawasan Falls Badian",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, deleniti?",
      image: "assets/images/badian-canyoneering.jpg",
      location: "Matotinao Badian Cebu",
      selected: false,

    },
    {
      id: 4,
      category_id: 4,
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
      name: "Cambais Alegria",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, deleniti?",
      image: "../../../assets/images/host-tourist-spot.jpg",
      location: "Compostela, Alegria, Cebu",
      selected: false,
    },
    {
      id: 4,
      category_id: 4,
      name: "Ligo Alegria",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, deleniti?",
      image: "../../../assets/images/host-tourist-spot.jpg",
      location: "Compostela, Alegria, Cebu",
      selected: false,
    },
    {
      id: 4,
      category_id: 4,
      name: "Canyo Alegria",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, deleniti?",
      image: "../../../assets/images/host-tourist-spot.jpg",
      location: "Compostela, Alegria, Cebu",
      selected: false,
    },
  ];

  programmingLanguages = [
    "Python",
    "TypeScript",
    "C",
    "C++",
    "Java",
    "Go",
    "JavaScript",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
  ];

  constructor() {}

  spotsListCategory: Spot[] = [];
  selectedSpots: Spot[] = [];

  spotsLocation = [];
  allSpotsName = [];

  searchInput: string;

  show = false;
  buttonSelectWord = "Select";

  option = {
    slidesPerView: 1.5,
    centeredSlides: true,
    // loop: true,
    // spaceBetween: 40,
    // autoplay:true,
  }

  hostSpot: Spot = {
    id: null,
    category_id: null,
    name: null,
    description: null,
    image: null,
    location: null,
    selected: null,  };

  ngOnInit() {
    this.getAllSpotsLocation();
    this.getAllSpotNames();
  }

  selectTouristSpot() {
    if(!this.selectedSpots.includes(this.hostSpot)){
      this.hostSpot.selected = true;
      this.selectedSpots.push(this.hostSpot);
      // this.buttonSelectWord = "Selected";
      this.show = false;
      console.log(this.hostSpot)
    }else{
      console.log("Spot is already selected!")
    }
  }

  showDetails(spot: Spot) {
    this.hostSpot = spot;
    this.show = true;
    console.log(this.hostSpot)

    //set the style of the details container to show in the page
    // console.log("Show details spot: " + spot)
  }

  closeSpotDetails() {
    this.show = false;
  }

  displayListOfSpotsInCategory(category: SpotCategory) {
    this.spotsListCategory = [];
    for (var i = 0; i < this.spots.length; i++) {
      if (this.spots[i].category_id == category.id) {
        this.spotsListCategory.push(this.spots[i]);
        // console.log(this.spotsListCategory);
        // console.log(this.spots[i]);
      }
    }
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

  cancelSelectedSpot(spot) {
    this.spots[this.spots.indexOf(spot)].selected = false;
    this.selectedSpots.splice(this.selectedSpots.indexOf(spot), 1)
  }

  submitSelectedHostSpots() {
    console.log("Selected Host Spots: " + JSON.stringify(this.selectedSpots))
  }  

  getAllSpotNames() {
    // this.spotsListCategory = []; 
    for(var i = 0; i < this.spots.length; i++) {
      this.allSpotsName.push(this.spots[i].name.toLowerCase())
    }
    console.log("All Spots' Name: " +this.allSpotsName)
  }

  getAllSpotBasedOnSearchInput() {
    this.spotsListCategory = []; 
    for(var i = 0; i < this.allSpotsName.length; i++) {
      for(var j = 0; j < this.spots.length; j++) {
        if(this.allSpotsName[i] === this.spots[j].name.toLowerCase()) {
          this.spotsListCategory.push(this.spots[j]);
        }
      }
    }
  }
}
