import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './components/signIn/signIn.component';
import { SignUpComponent } from './components/signUp/signUp.component';
import { ConfigComponent } from './components/config/config.component';
import { GameFrameComponent } from './components/gameFrame/gameFrame.component';
import { SignedInComponent } from './components/signedIn/signedIn.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { AnimationDefaultComponent } from './components/gameObjects/animation-default/animation-default.component';
import { AnimationStadtComponent } from './components/gameObjects/animation-stadt/animation-stadt.component';
import { AnimationArmyComponent } from './components/gameObjects/animation-army/animation-army.component';
import { AnimationSchiffComponent } from './components/gameObjects/animation-schiff/animation-schiff.component';
import { GameObjectComponent } from './components/gameObjects/game-object/game-object.component';
import { RoundPipe } from './pipes/round.pipe';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { OverlayComponent } from './components/overlay/overlay.component';
import { GameComponent } from './components/game/game.component';
import { UnsetComponent } from './components/unset/unset.component';
import { GameMenuBoxComponent } from './components/game-menu-box/game-menu-box.component';
import { GameMenuObjectComponent } from './components/game-menu-object/game-menu-object.component';
import { ConfigMapComponent } from './components/config-map/config-map.component';
const config: SocketIoConfig = { url: environment.backendLink, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    ConfigComponent,
    GameFrameComponent,
    SignedInComponent,
    AnimationDefaultComponent,
    AnimationStadtComponent,
    AnimationArmyComponent,
    AnimationSchiffComponent,
    GameObjectComponent,
    RoundPipe,
    GameMenuComponent,
    OverlayComponent,
    GameComponent,
    UnsetComponent,
    GameMenuBoxComponent,
    GameMenuObjectComponent,
    ConfigMapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
