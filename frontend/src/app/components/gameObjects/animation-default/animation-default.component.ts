import { Component, Input, OnInit } from '@angular/core';
import { GameObject } from 'src/app/model/game-object';

@Component({
  selector: 'app-animation-default',
  templateUrl: './animation-default.component.html',
  styleUrls: ['./animation-default.component.scss']
})
export class AnimationDefaultComponent implements OnInit {
  @Input() gameObject!: GameObject;

  constructor() { }

  ngOnInit(): void {
  }

}
