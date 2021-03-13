import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from 'process';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SelectHostTouristSpotService {

  constructor( private http: HttpClient) { }

  // retreiveAllTouristSpotCategories() {
  //   return this.http.get(`${environment.apiUrl}/service-provider/retrieveAllToristSpotCategories`);
  // }
}
