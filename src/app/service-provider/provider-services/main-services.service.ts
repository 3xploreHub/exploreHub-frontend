import { HttpClient } from '@angular/common/http';
  import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from 'src/app/modules/elementTools/interfaces/page';
import { environment } from 'src/environments/environment';
import { bookingData } from './interfaces/bookingData';

@Injectable({
  providedIn: 'root'
})
export class MainServicesService {
  private apiUrl = `${environment.apiUrl}api/service-provider`;

  public notification: EventEmitter<any> = new EventEmitter();
  public currentPage: Page;
  public canLeave: boolean = true;
  public currentBookingId: string = "";
  public currentBooking: bookingData;
  public creatingManual: boolean = false;
  public hasUnfinishedBooking: boolean = false;
  public socket: any;
  public user: any;
  public notify: any;
  public checkCurrentUser: EventEmitter<any> = new EventEmitter();
  constructor(
    private http: HttpClient
  ) { }

  getPages(status: string) {
    return this.http.get(`${this.apiUrl}/getPages/${status}`)
  }

  receiveNotification(data) {
    this.notification.emit(data);
  }
  
  checkUser() {
    this.checkCurrentUser.emit();
  }

  getPage(pageId: string) {
    return this.http.get(`${this.apiUrl}/getPage/${pageId}`)
  }

  getServices(pageId: string, pageType: string) {
    return this.http.get(`${this.apiUrl}/getServices/${pageId}/${pageType}`, { headers: { hideLoadingIndicator: "true" } });
  }

  getOnlinePages(category: string) {
    return this.http.get(`${this.apiUrl}/getOnlinePages/${category}`);
  }

  viewPage(page: any): Observable<any> {
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
    return this.http.post(`${this.apiUrl}/createBooking/${data.pageId}/${data.pageType}/${data.bookingId}`, { firstService: data.firstService, isManual: data.isManual })
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

  submitBooking(bookingId, notificationData = null, selectedServices = null, isManual = false) {
    const data = isManual ? { isManual: true, selectedServices: selectedServices } : notificationData
    return this.http.post(`${this.apiUrl}/submitBooking/${bookingId}`, data)
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

  getNotifications(hideLoading = false) {
    const config = hideLoading ? { headers: { hideLoadingIndicator: "true" } } : {}
    return this.http.get(`${this.apiUrl}/getNotifications`, config)
  }

  viewNotification(data) {
    return this.http.put(`${this.apiUrl}/viewNotification`, data)
  }

  removeSelectedItem(bookingId, selectedId) {
    return this.http.put(`${this.apiUrl}/removeSelectedItem/${bookingId}/${selectedId}`, {})
  }

  changeBookingStatus(status, notificationData) {
    return this.http.post(`${this.apiUrl}/changeBookingStatus/${status}`, notificationData)
  }

  getNotificationsCount() {
    return this.http.get(`${this.apiUrl}/getNotificationsCount`, { headers: { hideLoadingIndicator: "true" } })
  }

  createConversation(data) {
    return this.http.post(`${this.apiUrl}/createConversation`, data, { headers: { hideLoadingIndicator: "true" } })
  }

  createConvoForPageSubmission(data) {
    return this.http.post(`${this.apiUrl}/createConvoForPageSubmission`, data, { headers: { hideLoadingIndicator: "true" } })
  }

  getConversation(bookingId, pageId, receiver) {  
    return this.http.get(`${this.apiUrl}/getConversation/${bookingId}/${pageId}/${receiver}`)
  }

  sendMessage(data: any) {
    return this.http.post(`${this.apiUrl}/sendMessage`, data, { headers: { hideLoadingIndicator: "" } })
  }

  changePageStatus(data: any) {
    return this.http.post(`${this.apiUrl}/changePageStatus`, data)
  }

  getHostedPages(id) {
    return this.http.get(`${this.apiUrl}/getHostedPages/${id}`)
  }

  changeInitialStatus(data: any) {
    return this.http.post(`${this.apiUrl}/changeInitialStatus`, data)
  }

  getPageConversation(id) {
    return this.http.get(`${this.apiUrl}/getPageConversation/${id}`)
  }

  getConvoForPageSubmission(pageId, type) {
    return this.http.get(`${this.apiUrl}/getConvoForPageSubmission/${pageId}/${type}`)
  }

  getAllConversations(pageId) {
    return this.http.get(`${this.apiUrl}/getAllConversations/${pageId}/`)
  }

  openConvo(convoId, hideLoading = false) {
    const config = hideLoading? { headers: { hideLoadingIndicator: "true" }}: {}
    return this.http.post(`${this.apiUrl}/openConvo`, {convoId:convoId}, config)
  }

  searchTouristSpot(data) {
    return this.http.post(`${this.apiUrl}/searchTouristSpot`, data,{ headers: { hideLoadingIndicator: "true" } } )
  }

  getAllCategories() {
    return this.http.get(`${this.apiUrl}/getAllCategories`)
  }

  retrieveTouristSpotByCategory(data) {
    return this.http.post(`${this.apiUrl}/retrieveTouristSpotByCategory`, data)
  }

  deleteConfirmedPage(data) {
    return this.http.post(`${this.apiUrl}/deleteConfirmedPage/${data.pageId}/${data.pageType}`, data)
  } 
  
  getPageActiveBookings(pageId: string) {
    return this.http.get(`${this.apiUrl}/getPageActiveBookings/${pageId}`)
  }
}
