import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor( private http: HttpClient) { }

  // retreiveAllTouristSpotCategories() {
  //   return this.http.get(`${environment.apiUrl}service-provider/retrieveAllToristSpotCategories`);
  // }21  `a

  getUserInfo() {
    return this.http.get(`${environment.apiUrl}api/account/getUserInformation`);
  }

  updateUserInfo(userData) {
    return this.http.put(`${environment.apiUrl}api/account/updateUserInformation`, userData);
  }

  changePassword(password) {
    return this.http.post(`${environment.apiUrl}api/account/changePassword`, password);
  }

  addUserProfile(blobData) {
    const formData = new FormData();
    formData.append('image', blobData);
    
    // alert("BLOBDATA: " + JSON.stringify(blobData))

    return this.http.post(`${environment.apiUrl}api/account/addUserProfile`, formData, {
      headers: {
        containsFiles: ""
      }
    })
  }

  addUserProfile2(file) {
    const ext = file.name.split('.').pop();
    const formData = new FormData();
    formData.append('image', file, `myimage.${ext}`);

    return this.http.post(`${environment.apiUrl}api/account/addUserProfile`, formData, {
      headers: {
        containsFiles: ""
      }
    })
  }

  deleteProfile(file: string) {
    return this.http.post(`${environment.apiUrl}api/account/deleteProfile`, {profile: file}, {
      headers: { hideLoadingIndicator: "" },
    });
  }

} 
