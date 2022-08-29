import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Update } from 'src/app/model/update';

@Component({
  selector: 'app-game-object',
  templateUrl: './game-object.component.html',
  styleUrls: ['./game-object.component.scss'],
})
export class GameObjectComponent implements OnInit {
  @Input() gameObject!: Update;
  @Input() width: number = 0;
  @Input() height: number = 0;
  @Output()
  click = false;
  @Output('unClick') unClick: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  constructor() {}

  @Input() set setClick(value: boolean) {
    this.click = false;
  }

  ngOnInit(): void {
    console.log('tetst');
  }
  objClick(e: MouseEvent) {
    let strKey = e.ctrlKey;
    let beforClick = this.click;
    if (!strKey) {
      this.unClick.emit(strKey);
    }else{
      
    }
    setTimeout(() => {
      this.click = !beforClick;
    }, 1);
  }
}
