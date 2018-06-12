import { PlayerHomeComponent } from './player/player-home/player-home.component';
import { QuizComponent } from './player/quiz/quiz.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerComponent } from './player/player.component';

const routes: Routes = [
    {
        path: '',
        component: PlayerComponent,
        children: [
            {
                path: '',
                component: PlayerHomeComponent
            },
            {
                path: 'quiz',
                component: QuizComponent
            }
        ]
    },
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
