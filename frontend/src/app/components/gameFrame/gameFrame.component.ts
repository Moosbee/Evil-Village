import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { GameObject } from 'src/app/model/game-object';
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
  distance = 0;
  lastDistance = 0;
  twoTouch = false;
  gameObjects: GameObject[] = [];
  unClick = false;

  url = '';

  // @ViewChild('frame') public frame!: ElementRef;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.getInfoFast().subscribe((update: Update) => {
      this.gameObjects = update.gameObjects;
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

    this.calcPos(mausY, mausX, true, false, frame, map);
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

    // console.log(
    //   `ClientX: ${e.clientX},FrameWidthX: ${frame.offsetWidth},MausX: ${mausX}`
    // );
    // console.log(
    //   `ClientY: ${e.clientY},FrameHeightY: ${frame.offsetHeight},MausY: ${mausY}`
    // );

    e.preventDefault();

    this.calcPos(mausY, mausX, false, false, frame, map);
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

    this.calcPos(0, 0, true, true, frame, map);

    e.preventDefault();
  }

  touchStart(e: TouchEvent, frame: HTMLDivElement, map: HTMLImageElement) {
    let mausY = 1;
    let mausX = 1;
    let touch = e.touches;
    let bounding = frame.getBoundingClientRect();
    if (touch.length == 1) {
      mausY = (touch[0].clientY - bounding.y) / frame.offsetHeight;
      mausX = (touch[0].clientX - bounding.x) / frame.offsetWidth;
    }
    e.preventDefault();

    this.twoTouch = false;

    this.calcPos(mausY, mausX, true, false, frame, map);
  }

  touchDrag(e: TouchEvent, frame: HTMLDivElement, map: HTMLImageElement) {
    let mausY = 1;
    let mausX = 1;
    let touch = e.touches;
    let bounding = frame.getBoundingClientRect();
    if (touch.length == 1 && this.twoTouch == false) {
      mausY = touch[0].clientY / frame.offsetHeight;
      mausX = touch[0].clientX / frame.offsetWidth;

      this.calcPos(mausY, mausX, false, false, frame, map);
    }
    if (touch.length == 2) {
      let touchY1 = (touch[0].clientY - bounding.y) / frame.offsetHeight;
      let touchX1 = (touch[0].clientX - bounding.x) / frame.offsetWidth;
      let touchY2 = (touch[1].clientY - bounding.y) / frame.offsetHeight;
      let touchX2 = (touch[1].clientX - bounding.x) / frame.offsetWidth;

      mausY = touch[1].clientY / frame.offsetHeight;
      mausX = touch[1].clientX / frame.offsetWidth;

      this.twoTouch = true;

      this.lastDistance = this.distance;
      this.distance = Math.sqrt(
        Math.pow(touchX2 - touchX1, 2) + Math.pow(touchY2 - touchY1, 2)
      );
      let diff = this.lastDistance - this.distance;
      // this.zoom = this.zoom - diff;
      if (diff < 0) {
        if (!(map.clientWidth * (this.zoom * 0.75) > this.mapWidth)) {
          this.zoom = this.zoom + this.zoom / 100;
        }
        // this.top = this.top - 5;
        // this.left = this.left- 5;
      }
      if (diff > 0) {
        this.zoom = this.zoom - this.zoom / 100;
        // this.top = this.top + 5;
        // this.left = this.left + 5;
      }
      if (this.zoom < 0.75) {
        this.zoom = 0.75;
      }
      this.calcPos(mausY, mausX, false, true, frame, map);
    }
    e.preventDefault();
  }

  touchEnd(e: TouchEvent, zoomFrame: HTMLDivElement, map: HTMLImageElement) {
    let mausY = 1;
    let mausX = 1;
    let touch = e.touches;
    if (touch.length == 1) {
      mausY = touch[0].clientY / zoomFrame.offsetHeight;
      mausX = touch[0].clientX / zoomFrame.offsetWidth;
    } else {
      return;
    }

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
        this.calcPos(0, 0, false, true, frame, map);
        break;

      default:
        break;
    }
    this.calcPos(0, 0, true, true, frame, map);
  }

  calcPos(
    mausY: number,
    mausX: number,
    start: boolean,
    update: boolean,
    frame: HTMLDivElement,
    map: HTMLImageElement
  ) {
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
      // debugger;

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

      // this.left = this.left - diffX / this.zoom;
      // this.top = this.top - diffY / this.zoom;

      let diffHeight = map.clientHeight / frame.clientHeight;
      let diffWidth = map.clientWidth / frame.clientWidth;

      let calcDiffY = diffY / this.zoom / diffHeight;
      let calcDiffX = diffX / this.zoom / diffWidth;

      this.left = this.left - calcDiffX;
      this.top = this.top - calcDiffY;
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

  isSameGameObject(index: number, gameObject: GameObject) {
    return gameObject.name;
  }
}
