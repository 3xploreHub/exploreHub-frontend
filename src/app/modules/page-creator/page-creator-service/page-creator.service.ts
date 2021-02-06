import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Element } from '../../interfaces/Element';
import { TouristSpotPage } from '../../interfaces/tourist-spot-page';

export interface ApiImage {
  _id: string;
  url: string;
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

  saveComponent(component: Element): Observable<any> {
    return this.http.post(`${this.apiUrl}/addComponent`, component, {
      headers: { hideLoadingIndicator: "true" },
    });
  }

  editComponent(component: Element): Observable<any> {
    return this.http.put(`${this.apiUrl}/editComponent/${component.id}`, component, {
      headers: { hideLoadingIndicator: "true" },
    })
  }

  deleteComponent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteComponent/${id}`, {
      headers: { hideLoadingIndicator: "true" },
    })
  }

  saveComponenWithMedia(component: Element): Observable<any> {
    return this.http.post(`${this.apiUrl}/addComponenWithMedia`, component, {
      headers: { hideLoadingIndicator: "true" },
    });
  }

  uploadImage(blobData, ext):Observable<any> {
    const formData = new FormData();
    formData.append('image', blobData, `myimage.${ext}`);

    console.log(blobData)
    return this.http.post(`${this.apiUrl}/addComponentWithMedia`, formData, {
      headers: { hideLoadingIndicator: "", containsFiles: "" },
    });
    // console.log(formData);
    // const res: ApiImage = {
    //   _id: "123",
    //   name: "test",
    //   createdAt: new Date(),
    //   url: "http://localhost:3000/uploads/tourmeimage-1609160027028.png",
    // };
    // return of(res);
  }

  uploadImageFile(file: File) {
    const ext = file.name.split('.').pop();
    const formData = new FormData();
    formData.append('image', file, `myimage.${ext}`);

    return this.http.post(`${this.apiUrl}/addComponentWithMedia`, formData, {
      headers: { hideLoadingIndicator: "", containsFiles: "" },
    });
  }

  deleteImage(id) {
    return this.http.delete(`${this.apiUrl}/image/${id}`);
  }
}
