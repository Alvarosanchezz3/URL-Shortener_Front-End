import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { LinkService } from '../../link.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  providers: [LinkService]
})
export class DashboardComponent implements OnInit {
  email = '';
  urls: any[] = [];
  baseUrl = "https://shortener-urls.netlify.app";

  selectedItem: any = null;
  isDeletePopupOpen: boolean = false;
  isEditPopupOpen: boolean = false;
  popupData: { shortUrl: any, longUrl: any,description:any, isOpen: boolean } = { shortUrl: null, longUrl: null,description: null, isOpen: false };
  
  confirmString = '';
  description = ''

  stateCopy = false;

  constructor(private authService: AuthService,private linkService: LinkService) {
  }

  ngOnInit(): void {
    this.email = this.authService.getUserData()?.email
    this.getUrls();
  }

  // Método para recibir todas las urls creadas del usuario
  getUrls() {
    this.linkService.getLinksUser(this.email)
      .subscribe(
        (data: any) => {
          this.urls = data;
          this.getIdShortLinks();
          console.log(data)
        },
        error => {
          console.error('Error al obtener las URLs:', error);
        }
      );
  }

  // Recorta las urls cortas para dejar solo su id
  getIdShortLinks(): void {
      this.urls.forEach(url => {
        if (url.shortUrl.startsWith(this.baseUrl)) {
          url.shortUrl = url.shortUrl.substring(this.baseUrl.length);
        }
      });
  }
  
  // Método para abrir los diferentes menus y pop ups y manejar la info de cada uno de ellos
  togglePopup(action: string, isOpen: boolean, url: any): void {
    // Si hay un pop-up abierto, no deja abrir el menu de opciones
    if ((this.isEditPopupOpen || this.isDeletePopupOpen) && action === 'options') {
      return;
    } 
     // Si el menú de opciones está abierto y haces clic en él se cierra
    else if (action === 'options' && this.selectedItem === url) {
      this.selectedItem = null;
      return;
    }

    // Cierra el menú de opciones siempre que se abra un pop-up
    this.selectedItem = null;

    // Dependiendo de la acción abre un pop up u otro
    if (action === 'edit') {
      this.isEditPopupOpen = isOpen;
      this.isDeletePopupOpen = false;

    } else if (action === 'delete') {
      this.isDeletePopupOpen = isOpen;
      this.isEditPopupOpen = false;

    } else if (action === 'options') {
      // Invierte el estado del menú de opciones para cerrarlo si está abierto, o abrirlo si está cerrado
      this.selectedItem = this.selectedItem === url && !isOpen ? null : url;
    }

    if (action !== 'options') {
      this.popupData = isOpen ? { ...url } : { shortUrl: null, longUrl: null, description: null, isOpen: false };
      this.confirmString = '';
      this.description = '';
    }
  }

  // Copiar enlace en el portapapeles y enseñar pop up temporal de url copiada
  copyToClipboard(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    this.stateCopy = true;
    setTimeout(() => this.stateCopy = false, 3000);

    this.selectedItem = null;
  }

  // LLamada al Link Service para borrar url
  deleteUrl(longUrl: string) {
    if (this.confirmString === 'DELETE') {
        // Realiza la eliminación solo si la confirmación es correcta
        let data = { longUrl: longUrl, email: this.email };
        this.linkService.deleteLink(data).subscribe(
            (response) => {
                // Actualiza la lista para actualizar la página de tus URLs
                this.urls = this.urls.filter(url => url.longUrl !== longUrl);
                // Cierra el popup de eliminación
                this.togglePopup('delete', false, null);
                // Restablece el valor del campo de confirmación
                this.confirmString = '';
            },
            (error) => {
                console.error(error);
            }
        );
    }
  }

  // LLamada al Link Service para actualizar la descripción de una url
  updateUrlInfo(longUrl: string, description: string) {

    let data = { longUrl: longUrl, description: description, email: this.email };
    
    this.linkService.updateLink(data).subscribe(
      (response) => {
        const index = this.urls.findIndex(url => url.longUrl === longUrl);
        if (index !== -1) {
          this.urls[index].description = description;
        }
        this.togglePopup('edit', false, null);
      },
      (error) => {
        console.error('Error al actualizar el enlace:', error);
      }
    )
  }
}