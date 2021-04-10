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
  //   return this.http.get(`${environment.apiUrl}/service-provider/retrieveAllToristSpotCategories`);
  // }21  `a

  getUserInfo() {
    return this.http.get(`${environment.apiUrl}/account/getUserInformation`);
  }

  updateUserInfo(userData) {
    return this.http.put(`${environment.apiUrl}/account/updateUserInformation`, userData);
  }

  changePassword(password) {
    return this.http.post(`${environment.apiUrl}/account/changePassword`, password);
  }


  addUserProfile(blobData) {
    const formData = new FormData();
    formData.append('image', blobData);
    
    // alert("BLOBDATA: " + JSON.stringify(blobData))

    return this.http.post(`${environment.apiUrl}/account/addUserProfile`, formData, {
      headers: {
        containsFiles: ""
      }
    })
  }

  addUserProfile2(file) {
    const ext = file.name.split('.').pop();
    const formData = new FormData();
    formData.append('image', file, `myimage.${ext}`);

    return this.http.post(`${environment.apiUrl}/account/addUserProfile`, formData, {
      headers: {
        containsFiles: ""
      }
    })
  }

  // uploadImageFile(grandParentId: string, parentId: string, childId: string, parent: string, file: File) {
  //   const ext = file.name.split('.').pop();
  //   const formData = new FormData();
  //   formData.append('image', file, `myimage.${ext}`);

  //   const componentGroup = parent == "page" ? "addComponentImage" : "addItemChildComponentImage";
  //   const params = parent == "page" ? `${parentId}/${childId}/${this.pageType}` : `${this.currentPageId}/${grandParentId}/${parentId}/${childId}/${this.pageType}`;

  //   return this.http.post(`${this.apiUrl}/${componentGroup}/${params}`, formData, {
  //     headers: { hideLoadingIndicator: "", containsFiles: "" },
  //   });
  // }

  deleteProfile(image: string) {
    return this.http.post(`${environment.apiUrl}/account/deleteProfile`, image);
  }
} 
