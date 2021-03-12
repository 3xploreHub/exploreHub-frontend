import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MainServicesService {
  private apiUrl = `${environment.apiUrl}/service-provider`;
  public currentPage: Page;
  public pageId: string;
  public pageType: string;

  constructor(
    private http: HttpClient
  ) { }

  getPages(status: string) {
    return this.http.get(`${this.apiUrl}/getPages/${status}`)
  }

  getPage(pageId: string, pageType: string) {
    return this.http.get(`${this.apiUrl}/getPage/${pageId}/${pageType}`)
  }

  getServices(pageId: string, pageType: string) {
    return this.http.get(`${this.apiUrl}/getServices/${pageId}/${pageType}`, { headers: { hideLoadingIndicator: "true" } });
  }

  getOnlinePages() {
    return this.http.get(`${this.apiUrl}/getOnlinePages`);
  }
}
