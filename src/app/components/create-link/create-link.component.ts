import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { LinkService } from '../../link.service';

@Component({
  selector: 'app-create-link',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './create-link.component.html',
  styleUrl: './create-link.component.css',
  providers: [LinkService]
})
export class CreateLinkComponent {

  longUrl = '';
  shortUrl = '';

  description = '';
  email = ''

  urlFormat = false;

  constructor(private router: Router,private authService: AuthService,
              private linkService: LinkService ) {}

  validarFormatoUrl() {
    return this.urlFormat = this.longUrl.startsWith('https://'); // startsWith devuelve un valor booleano
  }

  acortarUrl() {
    // Llamada al Service para conseguir el email del usuario usando SessionStorage
    this.email = this.authService.getUserData()?.email

    if (this.description == '') {
      this.description = 'No description'
    }

    // Damos formato de json a los datos
    let data = {longUrl: this.longUrl, description: this.description, email: this.email}
    
    this.linkService.shortenLink(data).subscribe(
      (response: any) => {
        this.shortUrl = response.shortUrl;
        this.router.navigate(['/dashboard'])
      }, 
      (error) => {
        console.error('Error al acortar la URL:', error);
      }
    )
  }
}