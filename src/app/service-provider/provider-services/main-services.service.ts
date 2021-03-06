import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MainServicesService {
  private apiUrl = `${environment.apiUrl}/service-provider`;

  constructor(
    private http: HttpClient
    ) { }

  getPages() {
    return this.http.get(`${this.apiUrl}/getPages`)
  }
}
