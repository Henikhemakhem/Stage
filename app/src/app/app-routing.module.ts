import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TutorialComponent } from './tutorial/tutorial.component';

const routes: Routes = [

  {
    path:'home',
    pathMatch:'full',
    children: [
      {
        path:'',
        component:HomeComponent
      },
     
    ]
  },
  {
    path:'tutorial',
    pathMatch:'full',
    children: [
      {
        path:'',
        component:TutorialComponent
      },
     
    ]
  },]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
