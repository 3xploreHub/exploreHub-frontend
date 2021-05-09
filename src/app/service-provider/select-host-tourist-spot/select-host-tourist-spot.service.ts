import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from 'process';
import { environment } from 'src/environments/environment';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SelectHostTouristSpotService implements OnInit {

  constructor( private http: HttpClient, public menu: MenuController) { }

  ngOnInit() {

  }

  openFirst() {
    // this.menu.enable(true, 'first');
    // this.menu.open('first');
  }


  retreiveAllTouristSpotCategories() {
    return this.http.get(`${environment.apiUrl}/service-provider/retrieveAllToristSpotCategories`);
  }

}
