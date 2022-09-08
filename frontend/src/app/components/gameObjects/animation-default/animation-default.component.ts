import { Component, Input, OnInit } from '@angular/core';
import { Update } from 'src/app/model/update';

@Component({
  selector: 'app-animation-default',
  templateUrl: './animation-default.component.html',
  styleUrls: ['./animation-default.component.scss']
})
export class AnimationDefaultComponent implements OnInit {
  @Input() gameObject!: Update;

  constructor() { }

  ngOnInit(): void {
  }

}
