import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavController } from "@ionic/angular";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ActivatedRoute } from "@angular/router";

declare var google: any;

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {
  public location = "";

  @ViewChild('maps', { static: true })
  mapRef: ElementRef;

  latitude: any;
  longitude: any;
  public static lat;
  public static lon;

  constructor(
    public navCtrl: NavController,
    public geo: Geolocation,
    private router: ActivatedRoute
  ) {
    this.getGeoLocation();
  }
  ngOnInit() {
    let place = this.router.snapshot.paramMap.get("")
    this.location = place
  }

  getGeoLocation() {
    this.geo.getCurrentPosition().then((response)=> {
      this.latitude = response.coords.latitude;
      this.longitude = response.coords.longitude;
      this.showMap();
    }).catch((error) =>{
      console.log('Error', error);
    });
  }

  showMap() {
    const location = new google.maps.LatLng(this.latitude, this.longitude);
    var map = new google.maps.Map(document.getElementById('maps'), {
      center: location,
      zoom: 13,
      mapTypeId:  "roadmap",
      // google.maps.MapTypeId.ROADMAP
      // 
    });

    var input = document.getElementById('pac-input');
    console.log(input)
    var searchBox = new google.maps.places.SearchBox(input);

    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }

      markers.forEach(function(marker) {
        marker.setMap(null);
      });

      markers = [];
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place){
        // LocationSelectPage.lat = place.geometry.viewport.Ya;
        // LocationSelectPage.lon = place.geometry.viewport.Ua;
        if (!place.geometry) {
          console.log('No geometry');
          return;
        }

        var icon = {
          url: place.icon,
          size: new google.maps.Size(72,71),
          origin: new google.maps.Point(0,0),
          anchor: new google.maps.Point(17,34),
          scaledSize: new google.maps.Size(25,25)
        };

        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      map.fitBounds(bounds);
    });
  }

  

}
