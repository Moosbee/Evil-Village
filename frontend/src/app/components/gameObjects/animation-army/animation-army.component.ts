import { Component, Input, OnInit } from '@angular/core';
import { GameObject } from 'src/app/model/game-object';

@Component({
  selector: 'app-animation-army',
  templateUrl: './animation-army.component.html',
  styleUrls: ['./animation-army.component.scss'],
})
export class AnimationArmyComponent implements OnInit {
  @Input() gameObject!: GameObject;

  constructor() {}

  ngOnInit(): void {}
}
