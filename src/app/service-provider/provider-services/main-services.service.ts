import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainServicesService {
  private apiUrl = `${environment.apiUrl}/service-provider`;
  public currentPage: Page;
  public canLeave: boolean = true;
  public currentBooking: string = "";
  public hasUnfinishedBooking:boolean = false;

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

  viewPage(page: any):Observable<any> {
    return this.http.get(`${this.apiUrl}/viewPage/${page.pageId}/${page.pageType}`)
  }

  viewItems(params: any) {
    const { pageId, serviceId, pageType } = params;
    return this.http.get(`${this.apiUrl}/viewItems/${pageId}/${serviceId}/${pageType}`)
  }

  viewAllServices(pageId) {
    return this.http.get(`${this.apiUrl}/viewAllServices/${pageId}`)
  }

  createBooking(data) {
    return this.http.post(`${this.apiUrl}/createBooking/${data.pageId}/${data.pageType}/${data.bookingId}`, { firstService: data.firstService })
  }

  getBooking(bookingId, purpose = "add_services") {
    return this.http.get(`${this.apiUrl}/getBooking/${bookingId}/${purpose}`)
  }

  addBookingInfo(bookingId, bookingInfo) {
    return this.http.post(`${this.apiUrl}/addBookingInfo/${bookingId}`, bookingInfo)
  }

  getPageBookingInfo(data) {
    return this.http.get(`${this.apiUrl}/getPageBookingInfo/${data.pageId}/${data.pageType}/${data.bookingId}`)
  }

  submitBooking(bookingId) {
    return this.http.post(`${this.apiUrl}/submitBooking/${bookingId}`, {})
  }

  getBookings(status) {
    return this.http.get(`${this.apiUrl}/getBookings/${status}`, {})
  }

  viewBooking(bookingId) {
    return this.http.get(`${this.apiUrl}/viewBooking/${bookingId}`, { headers: { hideLoadingIndicator: "true" } })
  }

  getPageBooking(bookingStatus, pageId) {
    return this.http.get(`${this.apiUrl}/getPageBooking/${bookingStatus}/${pageId}`, { headers: { hideLoadingIndicator: "true" } })
  }

  deleteBooking(bookingId) {
    return this.http.delete(`${this.apiUrl}/deleteBooking/${bookingId}`)
  }

  getNotifications() {
    return this.http.get(`${this.apiUrl}/getNotifications`)
  }

  viewNotification(notifId) {
    return this.http.put(`${this.apiUrl}/viewNotification/${notifId}`, {})
  }
}
