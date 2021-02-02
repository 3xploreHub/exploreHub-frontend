import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isTabSwitch } from '@ionic/angular/directives/navigation/stack-utils';
import { Storage } from "@ionic/storage";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Element } from '../../interfaces/Element';
import { TouristSpotPage } from '../../interfaces/tourist-spot-page';

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
}
