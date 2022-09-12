import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Update } from 'src/app/model/update';
import { GameService } from 'src/app/service/game.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-gameFrame',
  templateUrl: './gameFrame.component.html',
  styleUrls: ['./gameFrame.component.scss'],
})
export class GameFrameComponent implements OnInit {
  link = environment.backendLink;
  mapWidth = 0;
  mapHeight = 0;
  left = -50;
  top = -50;
  leftImg = -50;
  topImg = -50;
  zoom = 1;
  loaded = false;

  posX = 0;
  posY = 0;
  lastPosX = 0;
  lastPosY = 0;
  gameObjects: Update[] = [];
  unClick = false;

  url = '';

  // @ViewChild('frame') public frame!: ElementRef;

  constructor(private gameService: GameService, private router: Router) {
    let token = localStorage.getItem('token');
    if (token == null && router.url != '/signUn') {
      this.router.navigate(['/signIn']);
      return;
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;

        if (this.url != '/game') return;
        let token = localStorage.getItem('token');
        if (token == null) {
          // this.router.navigate(['/signIn']);
          return;
        }
        this.gameService.setToken(token);

        this.gameService.getUpdate().subscribe((newGameObjects) => {
          this.gameObjects = newGameObjects;
        });
      }
    });
  }

  ngOnInit(): void {
    this.gameService.getUpdateSocket().subscribe((newGameObjects) => {
      this.gameObjects = newGameObjects;
      this.gameService.updateMenu(newGameObjects);
    });
  }

  loadedImg(e: any) {
    let ImgMap: HTMLImageElement = e.target;
    this.mapWidth = ImgMap.naturalWidth;
    this.mapHeight = ImgMap.naturalHeight;
    this.loaded = true;
  }
  mouseClick(e: MouseEvent, frame: HTMLDivElement, map: HTMLImageElement) {
    if (e.buttons != 1 && e.buttons != 2) {
      return;
    }
    let mausY = 1;
    let mausX = 1;
    let bounding = frame.getBoundingClientRect();
    mausY = (e.clientY - bounding.y) / frame.offsetHeight;
    mausX = (e.clientX - bounding.x) / frame.offsetWidth;

    e.preventDefault();

    this.calcPos(mausY, mausX, true, false);
  }
  mouseDrag(e: MouseEvent, frame: HTMLDivElement, map: HTMLImageElement) {
    if (e.buttons != 1 && e.buttons != 2) {
      return;
    }
    let mausY = 1;
    let mausX = 1;
    let bounding = frame.getBoundingClientRect();
    mausY = (e.clientY - bounding.y) / frame.offsetHeight;
    mausX = (e.clientX - bounding.x) / frame.offsetWidth;

    e.preventDefault();

    this.calcPos(mausY, mausX, false, false);
  }

  mouseUp(e: MouseEvent, zoomFrame: HTMLDivElement, map: HTMLImageElement) {
    if (e.buttons != 2) {
      return;
    }

    let mausY = 1;
    let mausX = 1;
    let bounding = zoomFrame.getBoundingClientRect();
    mausY = (e.clientY - bounding.y) / zoomFrame.offsetHeight;
    mausX = (e.clientX - bounding.x) / zoomFrame.offsetWidth;

    if (mausY < 0) {
      mausY = 0;
    } else if (mausY > 1) {
      mausY = 1;
    }
    if (mausX < 0) {
      mausX = 0;
    } else if (mausX > 1) {
      mausX = 1;
    }

    let posOnMapX = this.mapWidth * mausX;
    let posOnMapY = this.mapHeight * mausY;

    this.gameService.goToPos(posOnMapX, posOnMapY);

    e.preventDefault();
  }

  disableContextMenu(
    e: MouseEvent,
    zoomFrame: HTMLDivElement,
    map: HTMLImageElement
  ) {
    let mausY = 1;
    let mausX = 1;
    let bounding = zoomFrame.getBoundingClientRect();
    mausY = (e.clientY - bounding.y) / zoomFrame.offsetHeight;
    mausX = (e.clientX - bounding.x) / zoomFrame.offsetWidth;

    if (mausY < 0) {
      mausY = 0;
    } else if (mausY > 1) {
      mausY = 1;
    }
    if (mausX < 0) {
      mausX = 0;
    } else if (mausX > 1) {
      mausX = 1;
    }

    let posOnMapX = this.mapWidth * mausX;
    let posOnMapY = this.mapHeight * mausY;
    // console.log(`Click at X:${posOnMapX} and Y:${posOnMapY}`);

    this.gameService.goToPos(posOnMapX, posOnMapY);

    e.preventDefault();
  }

  mouseWheel(e: WheelEvent, frame: HTMLDivElement, map: HTMLImageElement) {
    if (e.deltaY == 0) return;
    if (e.deltaY < 0) {
      if (!(map.clientWidth * (this.zoom * 0.75) > this.mapWidth)) {
        this.zoom = this.zoom + this.zoom / 10;
      }
      // this.top = this.top - 5;
      // this.left = this.left- 5;
    }
    if (e.deltaY > 0) {
      this.zoom = this.zoom - this.zoom / 10;
      // this.top = this.top + 5;
      // this.left = this.left + 5;
    }
    if (this.zoom < 0.75) {
      this.zoom = 0.75;
    }

    this.zoom = Math.round((this.zoom + Number.EPSILON) * 100) / 100;

    this.calcPos(0, 0, true, true);

    e.preventDefault();
  }

  touchDrag(e: TouchEvent, frame: HTMLDivElement, map: HTMLImageElement) {
    let mausY = 1;
    let mausX = 1;
    let touch = e.touches;
    let bounding = frame.getBoundingClientRect();
    if (touch.length == 1) {
      mausY = (touch[0].clientY - bounding.y) / frame.offsetHeight;
      mausX = (touch[0].clientX - bounding.x) / frame.offsetWidth;
    }
    e.preventDefault();

    this.calcPos(mausY, mausX, false, false);
  }

  touchEnd(e: TouchEvent, frame: HTMLDivElement, map: HTMLImageElement) {
    e.preventDefault();
  }

  keyPress(e: KeyboardEvent, frame: HTMLDivElement, map: HTMLImageElement) {
    let key = e.key;
    switch (key) {
      case '1':
        this.zoom = 1;
        break;
      case '2':
        this.zoom = 2;
        break;
      case '3':
        this.calcPos(0, 0, false, true);
        break;

      default:
        break;
    }
    this.calcPos(0, 0, true, true);
  }

  calcPos(mausY: number, mausX: number, start: boolean, update: boolean) {
    if (!update) {
      if (mausY < 0) {
        mausY = 0;
      } else if (mausY > 1) {
        mausY = 1;
      }
      if (mausX < 0) {
        mausX = 0;
      } else if (mausX > 1) {
        mausX = 1;
      }

      this.lastPosX = this.posX;
      this.lastPosY = this.posY;
      this.posX = Math.round(mausX * 100);
      this.posY = Math.round(mausY * 100);

      if (start) {
        this.lastPosX = this.posX;
        this.lastPosY = this.posY;
      }
      let diffX = this.lastPosX - this.posX;
      let diffY = this.lastPosY - this.posY;

      // let diffXPX = (diffX / 100) * frame.offsetWidth;
      // let diffYPX = (diffY / 100) * frame.offsetHeight;

      this.left = this.left - diffX / this.zoom;
      this.top = this.top - diffY / this.zoom;
    }

    let diff = 50 / this.zoom - 50;
    this.leftImg = this.left - diff;
    this.topImg = this.top - diff;

    // if (this.left > 90) {
    //   this.left = 90;
    // }
    // if (this.top > 90) {
    //   this.top = 90;
    // }
    // if (this.left < -90) {
    //   this.left = -90;
    // }
    // if (this.top < -90) {
    //   this.top = -90;
    // }

    // let mapGCD=this.gcd(this.mapWidth, this.mapHeight);
    // let mapAspectWidth=this.mapWidth/ mapGCD;
    // let mapAspectHeight=this.mapHeight/ mapGCD;
    // let ratioRatioWidth=mapAspectWidth/16;
    // let ratioRatioHeight=mapAspectHeight/9;
  }

  unClickAll(e: boolean) {
    this.unClick = !this.unClick;
  }

  gcd(a: number, b: number): number {
    if (b === 0) {
      return a;
    } else {
      return this.gcd(b, a % b);
    }
  }

  isSameGameObject(index: number, gameObject: Update) {
    return gameObject.name;
  }
}
