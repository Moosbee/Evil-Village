import { Component, Input, OnInit } from '@angular/core';
import { Update } from 'src/app/model/update';

@Component({
  selector: 'app-animation-army',
  templateUrl: './animation-army.component.html',
  styleUrls: ['./animation-army.component.scss']
})
export class AnimationArmyComponent implements OnInit {
  @Input() gameObject!: Update;

  constructor() { }

  ngOnInit(): void {
  }

}
