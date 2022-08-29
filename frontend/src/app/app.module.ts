import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MainComponent } from './components/main/main.component';
import { SignInComponent } from './components/signIn/signIn.component';
import { SignUpComponent } from './components/signUp/signUp.component';
import { ConfigComponent } from './components/config/config.component';
import { GameFrameComponent } from './components/gameFrame/gameFrame.component';
import { SignedInComponent } from './components/signedIn/signedIn.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { DebugComponent } from './components/debug/debug.component';
import { WatchFrameComponent } from './components/watchFrame/watchFrame.component';
import { DefaultComponent } from './components/gameObjects/default/default.component';
import { StadtComponent } from './components/gameObjects/stadt/stadt.component';
import { ArmyComponent } from './components/gameObjects/army/army.component';
import { SchiffComponent } from './components/gameObjects/schiff/schiff.component';
import { GameObjectComponent } from './components/gameObjects/game-object/game-object.component';
import { RoundPipe } from './pipes/round.pipe';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
const config: SocketIoConfig = { url: environment.backendLink, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainComponent,
    SignInComponent,
    SignUpComponent,
    ConfigComponent,
    GameFrameComponent,
    SignedInComponent,
    DebugComponent,
    WatchFrameComponent,
    DefaultComponent,
    StadtComponent,
    ArmyComponent,
    SchiffComponent,
    GameObjectComponent,
    RoundPipe,
    GameMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
