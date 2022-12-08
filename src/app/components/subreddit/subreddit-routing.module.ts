import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubredditComponent } from './components/subreddit-detail/subreddit.component';

const routes: Routes = [
  {
    path: ':subreddit',
    component: SubredditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubredditRoutingModule { }
