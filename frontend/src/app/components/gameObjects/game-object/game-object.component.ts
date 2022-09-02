import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Update } from 'src/app/model/update';
import { GameService } from 'src/app/service/game.service';

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
  constructor(private gameService: GameService) {}

  @Input() set setClick(value: boolean) {
    this.click = false;
  }

  ngOnInit(): void {}
  objClick(e: MouseEvent) {
    let strKey = e.ctrlKey;
    let beforeClick = this.click;
    if (strKey) {
      if (beforeClick) {//true --> false
        this.gameService.removeMenu(this.gameObject);
      } else {
        this.gameService.addMenu(this.gameObject);
      }
    } else {
      if (beforeClick) {//true --> false
        this.gameService.resetMenu();
      } else {
        this.gameService.setMenu(this.gameObject);
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
