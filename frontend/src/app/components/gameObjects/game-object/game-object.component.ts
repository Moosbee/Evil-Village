import { Component, Input, OnInit } from '@angular/core';
import { Update } from 'src/app/model/update';

@Component({
  selector: 'app-game-object',
  templateUrl: './game-object.component.html',
  styleUrls: ['./game-object.component.scss'],
})
export class GameObjectComponent implements OnInit {
  @Input() gameObject!: Update;
  constructor() {}

  ngOnInit(): void {
    console.log("tetst");
  }
}
