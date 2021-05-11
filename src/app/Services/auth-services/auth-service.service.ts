import { EventEmitter, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, from } from "rxjs";
import { user } from "../../services-common-helper/constantValue/user";
import jwt_decode from "jwt-decode";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";
import userTokenType from "../../services-common-helper/constantValue/user-token-type";

@Injectable({
  providedIn: "root",
})

export class AuthService {
  private apiUrl = `${environment.apiUrl}api/account`;
  attemptedUrl: string;
  token = null;
  public checkCurrentUser: EventEmitter<any> = new EventEmitter();

  constructor(
    private http: HttpClient,
    public lStorage: Storage,
    public router: Router
  ) {
    this.get("currentUser").then((user) => {
      this.token = user;
    });
  }

  checkUser() {
    this.checkCurrentUser.emit();
  }

  initialRegistration(data: user): Observable<any> {
    return this.http.post(`${this.apiUrl}/initialRegistration`, data);
  }

  addAccountInformation(data: user): Observable<any> {
    return this.http.post(`${this.apiUrl}/addAccountInformation`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  getUserInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getUserInformation`);
  }

  checkEmailOrNumberAvailability(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/checkEmailOrNumberAvailability`,
      data,
      {
        headers: { check_availability: "true" },
      }
    );
  }

  findAccount(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/findAccount`, user);
  }

  findAccountById(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/findAccountById`, user);
  }

  requestCode(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/requestCode`, user);
  }

  submitCode(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/submitCode`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/changePassword`, data);
  }

  deleteAccount(): Observable<any> {
    return this.http.post(`${this.apiUrl}/deleteAccount`, null);
  }

  get(key) {
    return this.lStorage.ready().then(() => {
      return this.lStorage.get(key).then(
        (val) => {
          return val;
        },
        (error) => {
        }
      );
    });
  }

  getTokenObservable() {
    return from(this.get("currentUser"));
  }

  save(key: string, token: any) {
    this.lStorage.set(key, token);
  }

  async logOut() {
    this.attemptedUrl = "";
    return await this.lStorage.remove("currentUser");
  }

  async removeItem(key: string) {
    return await this.lStorage.remove(key);
  }

  decodeToken(token) {
    return jwt_decode(token);
  }

  hasAttemptedUrl() {
    return this.attemptedUrl ? this.attemptedUrl : "/service-provider";
  }

  isLoggedIn(type: string) {
    return this.get("currentUser").then((token) => {
      if (token !== null) {
        const dtoken = this.decodeToken(token);
        if (dtoken.type == type) {
          return true;
        } else {
          if (dtoken.type == userTokenType.passwordReset) {
            this.router.navigate(["/reset-password"]);
          } else if (dtoken.type == userTokenType.addAccountInfo) {
            this.router.navigate(["/add-account-info"]);
          } else if (dtoken.type == userTokenType.accountVerification) {
            this.router.navigate(["/verification"]);
          }
          return false;
        }
      }
      return false;
    });
  }

  getAccountType() {
    return this.get("currentUser").then((token) => {
      if (token !== null) {
        const dtoken = this.decodeToken(token);
        return dtoken.accountType
      }
      return null;
    });
  }

  getCurrentUser() {
    return this.get("currentUser").then((token) => {
      if (token !== null) {
        return this.decodeToken(token);
      }
      return null;
    });
  }
}
