import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LinkService } from '../../link.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.css',
  providers: [LinkService],
})
export class RedirectComponent implements OnInit {
  urlId: any = '';
  longUrl: string = '';

  constructor(private route: ActivatedRoute, private linkService: LinkService, private router: Router) { }

  ngOnInit() {
    this.urlId = this.route.snapshot.paramMap.get('UrlId');
    this.redirect();
  }

  redirect() {
    this.linkService.getLongUrltoRedirect(this.urlId).subscribe(
      (data: any) => {
        this.longUrl = data;
        window.location.href = this.longUrl;
      },
      error => {
        console.error('Error al obtener la URL:', error);
        this.longUrl = 'notFound';
        this.router.navigate(['/NotFound'])
      }
    );
  }
}