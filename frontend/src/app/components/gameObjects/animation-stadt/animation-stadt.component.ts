import { Component, Input, OnInit } from '@angular/core';
import { Update } from 'src/app/model/update';

@Component({
  selector: 'app-animation-stadt',
  templateUrl: './animation-stadt.component.html',
  styleUrls: ['./animation-stadt.component.scss']
})
export class AnimationStadtComponent implements OnInit {
  @Input() gameObject!: Update;
  
  constructor() { }

  ngOnInit(): void {
    
  }

}
