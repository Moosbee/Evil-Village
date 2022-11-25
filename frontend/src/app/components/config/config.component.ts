import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/model/config';
import { Location } from '@angular/common';
import { GameService } from 'src/app/service/game.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  constructor(private gameService: GameService, private location: Location) {
    if (!(localStorage.getItem('adminLevel') === '4')) {
      this.location.back();
    }
  }

  config: Config = {
    MAXPLAYERS: 1000,
    PLAYERFILE: './json/players.json',
    PLAINTEXTPASSWORD: true,
    FAVICON: 4,
    EXPRESSPORT: 3000,
    FRONTENDURL: 'http://localhost:4200',
    FRONTENDPATH: './angularBuild/',
    GAME: {
      RESETONSTART: true,
      MAPFILENAME: 'Aihoia.png',
      SAVEFILE: './json/save.json',
      RUNSPEED: 4,
      MAXGAMEOBJECTS: 25000,
    },
  };

  status = false;

  ngOnInit(): void {
    this.gameService.getConfig().subscribe((config) => {
      this.config = config;
    });
  }

  apply() {
    this.gameService.setConfig(this.config).subscribe((config) => {
      this.config = config;
      this.status = true;

      setTimeout(() => {
        this.status = false;
      }, 6000);
    });
  }
}
