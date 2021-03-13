import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class TouristServicesService {
  private apiUrl = `${environment.apiUrl}/tourist`;

  constructor(
    private http: HttpClient
  ) { }

  retrieveAllTouristSpotPage():Observable<any>{
      return this.http.get(`${this.apiUrl}/retrieveAllTouristSpotPage`)
    }
}
