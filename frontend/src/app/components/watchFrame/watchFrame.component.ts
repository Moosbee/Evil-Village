import { Component, OnInit } from '@angular/core';
import { GameService } from '../../service/game.service';

@Component({
  selector: 'app-WatchFrame',
  templateUrl: './watchFrame.component.html',
  styleUrls: ['./watchFrame.component.scss']
})
export class WatchFrameComponent implements OnInit {
  stuff:any;
  constructor(private gameService:GameService) { }

  ngOnInit(): void {
    this.gameService.getUpdateSocket().subscribe((text)=>{
      this.stuff=text;
    });
  }

}
