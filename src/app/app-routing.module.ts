import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { PostDetailComponent } from './components/post/components/post-detail/post-detail.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { AboutComponent } from './components/user/components/about/about.component';

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/home"
  },
  {
    path: "home", component: HomeComponent
  },
  {
    path: "authenticate", component: AuthenticateComponent
  },
  {
    path: "prefs", component: PreferencesComponent
  },
  {
    path: "about", component: AboutComponent
  },
  {
    path: "r/:subreddit/comments/:id",
    pathMatch: 'full',
    component: PostDetailComponent
  },
  {
    path: 'r',
    loadChildren: () => import('./components/subreddit/subreddit.module').then(m => m.SubredditModule)
  },
  {
    path: 'u',
    loadChildren: () => import('./components/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./components/search/search.module').then(m => m.SearchModule)
  },
  {
    path: "404", component: NotFoundComponent
  },
  {
    path: "**", component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
