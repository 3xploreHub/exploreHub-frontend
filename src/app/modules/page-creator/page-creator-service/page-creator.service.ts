import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { from, observable, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TouristSpotPage } from '../../interfaces/tourist-spot-page';
import { Element } from '../page-creator.component';

export interface Image {
  _id: string;
  url: string;
}
export interface Page {
  _id: string;
  components: any[];
  category: string;
}


@Injectable({
  providedIn: 'root'
})
export class PageCreatorService {
  private apiUrl = `${environment.apiUrl}/service-provider`;
  public

  constructor(
    public lStorage: Storage,
    private http: HttpClient,
  ) { }

  save(key: string, token: any) {
    this.lStorage.set(key, token);
  }

  get(key) {
    return this.lStorage.ready().then(() => {
      return this.lStorage.get(key).then(
        (val) => {
          return val;
        },
        (error) => {
          console.log("error in getting token form the storage ", error);
        }
      );
    });
  }

  getDraftTouristSpotPage(id: string): Observable<TouristSpotPage> {
    return this.http.get<TouristSpotPage>(`${this.apiUrl}/draftTouristSpotPage/${id}`)
  }

  saveComponent(component: Element, parentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/addComponent/${parentId}`, component, {
      headers: { hideLoadingIndicator: "true" },
    });
  }

  editComponent(component: Element, parentId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/editComponent/${parentId}`, component, {
      headers: { hideLoadingIndicator: "true" },
    })
  }

  deleteComponent(parentId: string, compId: string, images:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/deleteComponent/${parentId}/${compId}`, {images: images}, {
      headers: { hideLoadingIndicator: "true" },
    })
  }

  uploadImage(parentId: string, blobData, values: Element): Observable<any> {
    const formData = new FormData();
    formData.append('image', blobData);
    formData.append('values', JSON.stringify(values));

    return this.http.post(`${this.apiUrl}/addComponentWithMedia/${parentId}`, formData, {
      headers: { hideLoadingIndicator: "", containsFiles: "" },
    });
  }

  uploadImageFile(parentId: string, file: File, values: Element) {
    const ext = file.name.split('.').pop();
    const formData = new FormData();
    formData.append('image', file, `myimage.${ext}`);
    formData.append('values', JSON.stringify(values));

    return this.http.post(`${this.apiUrl}/addComponentWithMedia/${parentId}`, formData, {
      headers: { hideLoadingIndicator: "", containsFiles: "" },
    });
  }

  deleteImage(parentId: string, componentId: string, imageUrl: string, imageId: string) {
    return this.http.post(`${this.apiUrl}/deleteImage/${parentId}`,
      { imageUrl: imageUrl,componentId: componentId, imageId: imageId }, {
      headers: { hideLoadingIndicator: "" },
    });
  }

  createTouristSpotPage() {
    return this.http.post(`${this.apiUrl}/createTouristSpotPage`, {})
  }

  retrieveToristSpotPage(id) {
    return this.http.get(`${this.apiUrl}/retrieveToristSpotPage/${id}`)
  }
}
