import { Component, Input, OnInit } from '@angular/core';
import { GameObject } from 'src/app/model/game-object';

@Component({
  selector: 'app-animation-stadt',
  templateUrl: './animation-stadt.component.html',
  styleUrls: ['./animation-stadt.component.scss'],
})
export class AnimationStadtComponent implements OnInit {
  @Input() gameObject!: GameObject;

  constructor() {}

  ngOnInit(): void {}
}
