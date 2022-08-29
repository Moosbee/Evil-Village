import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './components/config/config.component';
import { DebugComponent } from './components/debug/debug.component';
import { GameMenuComponent } from './components/game-menu/game-menu.component';
import { GameFrameComponent } from './components/gameFrame/gameFrame.component';
import { MainComponent } from './components/main/main.component';
import { SignedInComponent } from './components/signedIn/signedIn.component';
import { SignInComponent } from './components/signIn/signIn.component';
import { SignUpComponent } from './components/signUp/signUp.component';
import { WatchFrameComponent } from './components/watchFrame/watchFrame.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '',
  //   pathMatch: 'full',
  // },
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'signIn',
    component: SignInComponent,
  },
  {
    path: 'signUp',
    component: SignUpComponent,
  },
  {
    path: 'signedIn',
    component: SignedInComponent,
  },
  {
    path: 'config',
    component: ConfigComponent,
  },
  {
    path: 'game',
    component: GameFrameComponent,
  },
  {
    path: 'watch',
    component: WatchFrameComponent,
  },
  {
    path: 'debug',
    component: DebugComponent,
  },
  {
    path: 'men',
    component: GameMenuComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
