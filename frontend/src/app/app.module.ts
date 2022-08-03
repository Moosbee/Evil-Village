import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ConfigComponent } from './config/config.component';
import { FrameComponent } from './game/frame/frame.component';
import { SignedinComponent } from './signedin/signedin.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { DebugComponent } from './debug/debug.component';
import { WatchFrameComponent } from './watch-frame/watch-frame.component';
const config: SocketIoConfig = { url: environment.backendLink, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainComponent,
    SigninComponent,
    SignupComponent,
    ConfigComponent,
    FrameComponent,
    SignedinComponent,
    DebugComponent,
    WatchFrameComponent
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
