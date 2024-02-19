import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  
  urlBase: string = 'api-url-shortener.fly.dev'
  urlLongToRedirect: string = 'https://' + this.urlBase + '/api/url/redirect/'
  urlLinksUser: string = 'https://' + this.urlBase + '/api/url/email/'
  urlshorter: string = 'https://' + this.urlBase + '/api/url/shorten';
  urlDeleteLinks: string = 'https://' + this.urlBase + '/api/url/delete'
  urlUpdateLinks: string = 'https://' + this.urlBase + '/api/url/update'

  constructor(private http: HttpClient) {}

  getLinksUser(email: string) {
    return this.http.get(this.urlLinksUser + email)
  }

  shortenLink(data:any) {
    return this.http.post(this.urlshorter, data)
  }

  deleteLink(data: any) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data,
    };
    return this.http.delete(this.urlDeleteLinks, options);
  }

  updateLink(data:any) {
    return this.http.put(this.urlUpdateLinks, data)
  }

  getLongUrltoRedirect(id: any) {
    return this.http.get(this.urlLongToRedirect + id, { responseType: 'text' });
  }
}