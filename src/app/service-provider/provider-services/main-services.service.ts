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

  viewPage(page: any) {
    return this.http.get(`${this.apiUrl}/viewPage/${page.pageId}/${page.pageType}`)
  }

  viewItems(params: any) {
    const { pageId, serviceId, pageType} = params;
    return this.http.get(`${this.apiUrl}/viewItems/${pageId}/${serviceId}/${pageType}`)
  }
}
