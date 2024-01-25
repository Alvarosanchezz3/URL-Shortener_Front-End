import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogged: string = 'stateLogin';

  email = '';

  urlBase: string = 'localhost:8080'
  urlRegister: string = 'http://' + this.urlBase + '/api/url/register';

  constructor(private router: Router, private http: HttpClient) {}

  getUserData() {
    const userInfo = sessionStorage.getItem("infoUserLogged");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      let userData = { email: parsedUserInfo.email, userName: parsedUserInfo.name, userProfileImg: parsedUserInfo.picture }
      return userData;
    }
    return null
  }

  createUser(data: any) {
    return this.http.post(this.urlRegister, data)
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem(this.isLogged) === 'true';
  }
  
  setLoggedIn(value: boolean): void {
    sessionStorage.setItem(this.isLogged, value ? 'true' : 'false');
  }

  signOut() {
    google.accounts.id.disableAutoSelect();
    this.setLoggedIn(false)
    sessionStorage.removeItem("infoUserLogged");
    this.router.navigate(["login"]);
  }
}