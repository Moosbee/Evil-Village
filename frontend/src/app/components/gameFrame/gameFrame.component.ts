import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-gameFrame',
  templateUrl: './gameFrame.component.html',
  styleUrls: ['./gameFrame.component.scss'],
})
export class GameFrameComponent implements OnInit {
  link = environment.backendLink;
  width = 0;
  height = 0;
  left = 0;
  top = 0;

  posX = 0;
  posY = 0;
  lastPosX = 0;
  lastPosY = 0;

  // @ViewChild('frame') public frame!: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  loadedImg(e: any) {
    let ImgMap: HTMLImageElement = e.target;
    this.width = ImgMap.naturalWidth;
    this.height = ImgMap.naturalHeight;
  }
  mouseClick(e: MouseEvent, frame: HTMLDivElement) {
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
  mouseDrag(e: MouseEvent, frame: HTMLDivElement) {
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

  touchDrag(e: TouchEvent, frame: HTMLDivElement) {
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

    let diffXPX = (diffX / 100) * frame.offsetWidth;
    let diffYPX = (diffY / 100) * frame.offsetHeight;

    this.left = this.left - diffXPX;
    this.top = this.top - diffYPX;

    // if (this.left < -100) {
    //   this.left = -100;
    // }
    if (this.left > 0) {
      this.left = 0;
    }
    if (this.top < -+frame.offsetHeight) {
      this.top = -+frame.offsetHeight;
    }
    if (this.top > 0) {
      this.top = 0;
    }
  }

  calcProzentToPX(frame: HTMLDivElement) {}
}
