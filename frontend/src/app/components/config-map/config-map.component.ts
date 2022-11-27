import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MapFile } from 'src/app/model/map-file';
import { GameService } from 'src/app/service/game.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-config-map',
  templateUrl: './config-map.component.html',
  styleUrls: ['./config-map.component.scss'],
})
export class ConfigMapComponent implements OnInit {
  @Input() map: string = '';
  @Output() mapChange = new EventEmitter<string>();

  maps: MapFile[] = [];
  link = environment.backendLink;

  constructor(private gameService: GameService) {
    this.gameService.getMaps().subscribe((maps) => {
      this.maps = maps;
    });
  }

  ngOnInit(): void {}

  mapModelChange(e: string) {
    this.map = e;
    this.mapChange.emit(e);
  }
}
