import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuizComponent } from './player/quiz/quiz.component';
import { PlayerHomeComponent } from './player/player-home/player-home.component';
import { LoginComponent } from './player/login/login.component';
import { LoginAdminComponent } from './admin/login-admin/login-admin.component';

import { ReactiveFormsModule } from '@angular/forms';
import { WaitingRoomComponent } from './player/waiting-room/waiting-room.component';
import { BeforeStartComponent } from './admin/before-start/before-start.component';
import { ControlGameComponent } from './admin/control-game/control-game.component';
import { ResultsComponent } from './admin/results/results.component';
import { MarkdownModule } from 'ngx-markdown';
import { PlayersListComponent } from './shared/players-list/players-list.component';
import { BackgroundComponent } from './shared/background/background.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    AdminComponent,
    DashboardComponent,
    QuizComponent,
    PlayerHomeComponent,
    LoginComponent,
    LoginAdminComponent,
    WaitingRoomComponent,
    BeforeStartComponent,
    ControlGameComponent,
    ResultsComponent,
    PlayersListComponent,
    BackgroundComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'fame' }),
    MarkdownModule.forRoot(),
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
