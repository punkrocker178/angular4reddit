import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';


const routes: Routes = [
  {
    path: "home", component: HomeComponent
  },
  {
    path: "authenticate", component: AuthenticateComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
