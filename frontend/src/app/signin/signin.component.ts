import { Component, OnInit } from '@angular/core';
import { Auth } from '../model/auth';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  user:Auth={};
  constructor() { }

  ngOnInit(): void {
  }
  signin(e:Event){

  }

}
