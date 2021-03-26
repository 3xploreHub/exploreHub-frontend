import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor( private http: HttpClient) { }

  // retreiveAllTouristSpotCategories() {
  //   return this.http.get(`${environment.apiUrl}/service-provider/retrieveAllToristSpotCategories`);
  // }21  `a

  getUserInfo() {
    return this.http.get(`${environment.apiUrl}/account/getUserInformation`);
  }

  updateUserInfo(id, userData) {
    return this.http.put(`${environment.apiUrl}/account/updateUserInformation/${id}`, userData);
  }

}
