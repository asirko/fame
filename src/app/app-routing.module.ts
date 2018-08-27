import { LoginAdminComponent } from './admin/login-admin/login-admin.component';
import { PlayerHomeComponent } from './player/player-home/player-home.component';
import { QuizComponent } from './player/quiz/quiz.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerComponent } from './player/player.component';
import { LoginComponent } from './player/login/login.component';
import { PlayerGuard } from './player/player.guard';
import { WaitingRoomComponent } from './player/waiting-room/waiting-room.component';
import { BeforeStartComponent } from './admin/before-start/before-start.component';
import { ControlGameComponent } from './admin/control-game/control-game.component';
import { ResultsComponent } from './admin/results/results.component';
import { AdminGuard } from './admin/admin.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  }, {
    path: '',
    component: PlayerComponent,
    canActivate: [ PlayerGuard ],
    children: [
      {
        path: '',
        component: PlayerHomeComponent
      }, {
        path: 'waitingroom',
        component: WaitingRoomComponent
      }, {
        path: 'quiz',
        component: QuizComponent
      }, {
        path: 'player-home',
        component: PlayerHomeComponent
      },
    ]
  }, {
    path: 'loginAdmin',
    component: LoginAdminComponent
  }, {
    path: 'admin',
    component: AdminComponent,
    canActivate: [ AdminGuard ],
    children: [
      {
        path: 'before-start',
        component: BeforeStartComponent,
      }, {
        path: 'control-game',
        component: ControlGameComponent,
      }, {
        path: 'results',
        component: ResultsComponent,
      },
    ],
  }, {
    path: 'dashboard',
    component: DashboardComponent
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
