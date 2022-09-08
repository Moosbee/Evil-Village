import { Component, Input, OnInit } from '@angular/core';
import { Update } from 'src/app/model/update';

@Component({
  selector: 'app-animation-schiff',
  templateUrl: './animation-schiff.component.html',
  styleUrls: ['./animation-schiff.component.scss']
})
export class AnimationSchiffComponent implements OnInit {
  @Input() gameObject!: Update;

  constructor() { }

  ngOnInit(): void {
  }

}
