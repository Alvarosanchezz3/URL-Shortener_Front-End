import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  isLoggedIn:boolean = false;

  userName: any
  userProfileImg: any
  
  constructor(private authService: AuthService) {}

  ngOnInit ():void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.userName = this.authService.getUserData()?.userName;
    this.userProfileImg = this.authService.getUserData()?.userProfileImg;
  }

  signOut() {
    this.authService.signOut();
  }
}
