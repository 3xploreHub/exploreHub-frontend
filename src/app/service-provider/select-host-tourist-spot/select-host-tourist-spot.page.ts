import { Component, OnInit } from "@angular/core";
// import { TouristSpotPage } from "src/app/modules/interfaces/tourist-spot-page";
import { SelectHostTouristSpotService } from "./select-host-tourist-spot.service";
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PageCreatorService } from "src/app/modules/page-creator/page-creator-service/page-creator.service";
import { TouristSpotPage } from "src/app/modules/elementTools/interfaces/tourist-spot-page";
import { ElementValues } from "src/app/modules/elementTools/interfaces/ElementValues";
import { AlertController } from "@ionic/angular";

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
  touristSpotPages: TouristSpotPage[] = [];
  selectedPage:TouristSpotPage;
  keyupValues = "";

  sampleCategory;

  constructor(
    private router: Router,
    private creator: PageCreatorService,
    public alert: AlertController,
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
    this.retrieveAllTouristSpotsPage();
    // this.getAllSpotsLocation();
    // this.getAllSpotNames();

    // this.getAllTouristSpot();
    this.retreiveAllTouristSpotCategory();
  }

  retrieveAllTouristSpotsPage() {
    this.creator.retrieveAllTouristSpotsPage().subscribe(
      (response: TouristSpotPage[]) => {
        this.touristSpotPages = response;
      },
      error => {
        console.log(error);
        
      }
    )
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

  // getAllTouristSpot() {
  //   for(var i = 0; i<this.spots.length; i++) {
  //     this.spotsListCategory.push(this.spots[i]);
  //   }
  // }

  // displayListOfSpotsInCategory(category: SpotCategory) {
  //   for (var i = 0; i < this.spots.length; i++) {
  //     if (this.spots[i].category_name == category.name) {
  //       this.spotsListCategory.push(this.spots[i]);
  //     }
  //   }
  //   console.log("Category Selected: " , JSON.stringify(category))
  // }

  showDetails(spot: any) {
    this.yourHostSpot = spot;
    this.show = true;
  }

  selectTouristSpot() {
    console.log("Before Selected Spot: ", this.selectedSpots)
    this.selectedSpots = [];
    if(!this.selectedSpots.includes(this.yourHostSpot)) {
      this.selectedSpots.push(this.yourHostSpot);
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

  // getAllSpotsLocation() {
  //   for (var i = 0; i < this.spots.length; i++) {
  //     const location = this.spots[i].location.toLowerCase();
  //     if (this.spotsLocation.indexOf(location) !== -1) {
  //       continue;
  //     }
  //     this.spotsLocation.push(location);
  //   }
  //   console.log("Spot Location", this.spotsLocation);
  // }

  getAllSpotsBasedOnSearch() {}

  createServicePage() {
    let hostTouristSpot = {_id: this.selectedPage._id, municipality: this.selectedPage.components[3].data.text, city: this.selectedPage.components[4].data.text}
    this.creator.createPage("service",hostTouristSpot).subscribe(
      (response: any) => {
        this.router.navigate(["/service-provider/create-service-page", response._id])
      },
      error => {
        this.presentAlert("An error occured! Please try again later.")
      }
    )
  }

 

  // getAllSpotNames() {
  //   // this.spotsListCategory = [];
  //   for (var i = 0; i < this.spots.length; i++) {
  //     this.allSpotsName.push(this.spots[i].name.toLowerCase());
  //   }
  //   console.log("All Spots' Name: " + this.allSpotsName);
  // }

  // getAllSpotBasedOnSearchInput() {
  //   this.spotsListCategory = [];
  //   for (var i = 0; i < this.allSpotsName.length; i++) {
  //     for (var j = 0; j < this.spots.length; j++) {
  //       if (this.allSpotsName[i] === this.spots[j].name.toLowerCase()) {
  //         this.spotsListCategory.push(this.spots[j]);
  //       }
  //     }
  //   }
  // }

  async presentAlert(message) {
    const alert = await this.alert.create({
      cssClass: "my-custom-class",
      header: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

}
