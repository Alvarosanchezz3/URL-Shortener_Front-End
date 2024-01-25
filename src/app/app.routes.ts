import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateLinkComponent } from './components/create-link/create-link.component';
import { RedirectComponent } from './components/redirect/redirect.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'create', component: CreateLinkComponent},
    {path: ':UrlId', component: RedirectComponent},
    {path: 'NotFound', component: RedirectComponent}
];
