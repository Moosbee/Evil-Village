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
    MAXPLAYERS: 0,
    PLAYERFILE: '',
    PLAINTEXTPASSWORD: false,
    EXPRESSPORT: 0,
    FRONTENDURL: '',
    FRONTENDPATH: '',
    GAME: {
      RESETONSTART: false,
      MAPFILENAME: '',
      SAVEFILE: '',
      RUNSPEED: 0,
      MAXGAMEOBJECTS: 0,
    },
  };

  status = 0;

  changeMap = false;

  ngOnInit(): void {
    this.gameService.getConfig().subscribe((config) => {
      this.config = config;
    });
  }

  apply() {
    this.status = 1;
    this.gameService.setConfig(this.config).subscribe((config) => {
      this.config = config;
      this.status = 2;

      setTimeout(() => {
        this.status = 0;
      }, 6000);
    });
  }

  selectMap() {
    this.changeMap = !this.changeMap;
  }

  setMap(e: MouseEvent, option: 'none' | 'reboot' | 'reset') {
    this.gameService
      .setMap(this.config.GAME.MAPFILENAME, option)
      .subscribe((config) => {
        this.config = config;
        this.status = 2;

        setTimeout(() => {
          this.status = 0;
        }, 6000);
      });
  }
}
