import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { PostDetailComponent } from './components/post/components/post-detail/post-detail.component';
import { SubredditComponent } from './components/subreddit/subreddit.component';
import { UserProfileComponent } from './components/user/user-profile.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SearchPageComponent } from './components/search/components/search-page/search-page.component';


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
    path: "r/:subreddit", component: SubredditComponent
  },
  {
    path: "r/:subreddit/comments/:id", component: PostDetailComponent
  },
  {
    path: "u/:user", component: UserProfileComponent
  },
  {
    path: "search/:term", component: SearchPageComponent
  },
  {
    path: "404", component: NotFoundComponent
  },
  {
    path: "**", component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
