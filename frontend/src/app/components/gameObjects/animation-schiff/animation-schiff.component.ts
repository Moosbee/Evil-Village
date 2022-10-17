import { Component, Input, OnInit } from '@angular/core';
import { GameObject } from 'src/app/model/game-object';

@Component({
  selector: 'app-animation-schiff',
  templateUrl: './animation-schiff.component.html',
  styleUrls: ['./animation-schiff.component.scss'],
})
export class AnimationSchiffComponent implements OnInit {
  @Input() gameObject!: GameObject;

  constructor() {}

  ngOnInit(): void {}
}
