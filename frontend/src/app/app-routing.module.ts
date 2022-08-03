import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { DebugComponent } from './debug/debug.component';
import { FrameComponent } from './game/frame/frame.component';
import { MainComponent } from './main/main.component';
import { SignedinComponent } from './signedin/signedin.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { WatchFrameComponent } from './watch-frame/watch-frame.component';

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
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'signedin',
    component: SignedinComponent,
  },
  {
    path: 'config',
    component: ConfigComponent,
  },
  {
    path: 'game',
    component: FrameComponent,
  },
  {
    path: 'watch',
    component: WatchFrameComponent,
  },
  {
    path: 'debug',
    component: DebugComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
