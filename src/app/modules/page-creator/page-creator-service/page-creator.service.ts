import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isTabSwitch } from '@ionic/angular/directives/navigation/stack-utils';
import { Storage } from "@ionic/storage";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TouristSpotPage } from '../../interfaces/tourist-spot-page';

@Injectable({
  providedIn: 'root'
})
export class PageCreatorService {
  private apiUrl = `${environment.apiUrl}/service-provider`;

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

  saveComponent(): Observable<any> {
    return <any>{ response: "" }
  }
}
