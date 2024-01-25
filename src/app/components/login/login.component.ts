import { Component, NgZone, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  loading: boolean = false;

  constructor(private router: Router, private authService: AuthService, private ngZone: NgZone) {}

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '922871056667-iumri498knb4jbfjuvcljid7vkmbd9k2.apps.googleusercontent.com',
      callback: (resp: any) => {
        this.handleLogin(resp);
      }
    });

    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      size: 'large',
      locale: 'en',
      width: 210,
      text: 'signin_with'
    });
  }

  private decodeToken(token: string): any { // Pasar el json a charset UTF-8 y decodificarlo
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedToken = JSON.parse(decodeURIComponent(escape(atob(base64))));
    return decodedToken;
}

  handleLogin(response: any) {
    if (response) {
      const payLoad = this.decodeToken(response.credential);

      let data = { email: payLoad.email };

      this.authService.createUser(data).subscribe(response => {
        // Manejar la respuesta del servidor si es necesario
        console.log(response);
      });

      sessionStorage.setItem("infoUserLogged", JSON.stringify(payLoad));
      this.authService.setLoggedIn(true);

      this.loading = true; // Se pasa a true para ver el ICONO DE LOADING

      setTimeout(() => {

        // Utilizar NgZone para asegurarse de que Angular detecte los cambios
        this.ngZone.run(() => {
 
          this.router.navigate(['']);
          this.loading = false;
        });
      }, 2000);
    }
  }
}