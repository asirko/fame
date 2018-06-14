import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerComponent } from './player/player.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuizComponent } from './player/quiz/quiz.component';
import { PlayerHomeComponent } from './player/player-home/player-home.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    AdminComponent,
    DashboardComponent,
    QuizComponent,
    PlayerHomeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'fame' }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
