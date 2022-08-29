import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Update } from 'src/app/model/update';
import { GameMenuService } from 'src/app/service/game-menu.service';

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
  constructor(private gameMenuService: GameMenuService) {}

  @Input() set setClick(value: boolean) {
    this.click = false;
  }

  ngOnInit(): void {}
  objClick(e: MouseEvent) {
    let strKey = e.ctrlKey;
    let beforeClick = this.click;
    if (strKey) {
      if (beforeClick) {//true --> false
        this.gameMenuService.removeMenu(this.gameObject);
      } else {
        this.gameMenuService.addMenu(this.gameObject);
      }
    } else {
      if (beforeClick) {//true --> false
        this.gameMenuService.resetMenu();
      } else {
        this.gameMenuService.setMenu(this.gameObject);
      }
      this.unClick.emit(strKey);
    }
    if (beforeClick) {
    }
    setTimeout(() => {
      this.click = !beforeClick;
    }, 1);
  }
}
