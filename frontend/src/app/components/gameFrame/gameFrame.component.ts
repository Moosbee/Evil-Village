import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  left = 0;
  top = 0;
  zoom = 100;

  posX = 0;
  posY = 0;
  lastPosX = 0;
  lastPosY = 0;

  // @ViewChild('frame') public frame!: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  loadedImg(e: any) {
    let ImgMap: HTMLImageElement = e.target;
    this.mapWidth = ImgMap.naturalWidth;
    this.mapHeight = ImgMap.naturalHeight;
  }
  mouseClick(e: MouseEvent, frame: HTMLDivElement,map:HTMLImageElement) {
    if (e.buttons != 1) {
      return;
    }
    let mausY = 1;
    let mausX = 1;
    let bounding = frame.getBoundingClientRect();
    mausY = (e.clientY - bounding.y) / frame.offsetHeight;
    mausX = (e.clientX - bounding.x) / frame.offsetWidth;

    e.preventDefault();

    this.calcMove(mausY, mausX, true, frame);
  }
  mouseDrag(e: MouseEvent, frame: HTMLDivElement,map:HTMLImageElement) {
    if (e.buttons != 1) {
      return;
    }
    let mausY = 1;
    let mausX = 1;
    let bounding = frame.getBoundingClientRect();
    mausY = (e.clientY - bounding.y) / frame.offsetHeight;
    mausX = (e.clientX - bounding.x) / frame.offsetWidth;

    e.preventDefault();

    this.calcMove(mausY, mausX, false, frame);
  }

  mouseWheel(e: WheelEvent, frame: HTMLDivElement,map:HTMLImageElement) {
    let move = e.deltaY;
    // console.log(move);
    if (e.deltaY == 0) return;
    if (e.deltaY < 0 && map.clientWidth<this.mapWidth) {
      this.zoom = this.zoom + (this.zoom/10);
      // this.top = this.top - 5;
      // this.left = this.left- 5;
    }
    if (e.deltaY > 0 && this.zoom>90) {
      this.zoom = this.zoom - (this.zoom/10);
      // this.top = this.top + 5;
      // this.left = this.left + 5;
    }

    e.preventDefault();
  }

  touchDrag(e: TouchEvent, frame: HTMLDivElement,map:HTMLImageElement) {
    let mausY = 1;
    let mausX = 1;
    let touch = e.touches;
    let bounding = frame.getBoundingClientRect();
    if (touch.length == 1) {
      mausY = (touch[0].clientY - bounding.y) / frame.offsetHeight;
      mausX = (touch[0].clientX - bounding.x) / frame.offsetWidth;
    }
    e.preventDefault();

    this.calcMove(mausY, mausX, false, frame);
  }
  calcMove(
    mausY: number,
    mausX: number,
    start: boolean,
    frame: HTMLDivElement
  ) {
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

    this.left = this.left - (diffX/(this.zoom/100));
    this.top = this.top - (diffY/(this.zoom/100));

    if (this.left > 90) {
      this.left = 90;
    }
    if (this.top > 90) {
      this.top = 90;
    }
    if (this.left < -90) {
      this.left = -90;
    }
    if (this.top < -90) {
      this.top = -90;
    }

    // let mapGCD=this.gcd(this.mapWidth, this.mapHeight);
    // let mapAspectWidth=this.mapWidth/ mapGCD;
    // let mapAspectHeight=this.mapHeight/ mapGCD;
    // let ratioRatioWidth=mapAspectWidth/16;
    // let ratioRatioHeight=mapAspectHeight/9;
  }

  gcd(a: number, b: number): number {
    if (b === 0) {
      return a;
    } else {
      return this.gcd(b, a % b);
    }
  }
}
