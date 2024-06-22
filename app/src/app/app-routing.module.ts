import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { AjoutformationComponent } from './ajoutformation/ajoutformation.component';

const routes: Routes = [
  {
    path: 'formation',
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'ajout',
        component: AjoutformationComponent
      },
      {
        path: ':id/edit',
        component: AjoutformationComponent // Route pour l'édition d'une formation spécifique
      }
    ]
  },
  {
    path: 'tutorial',
    component: TutorialComponent
  },
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
