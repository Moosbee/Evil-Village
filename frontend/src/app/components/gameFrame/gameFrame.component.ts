import { Component, OnInit } from '@angular/core';
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

  constructor() {}

  ngOnInit(): void {}

  loadedImg(e: any) {
    let ImgMap: HTMLImageElement = e.target;
    this.width = ImgMap.naturalWidth;
    this.height = ImgMap.naturalHeight;
  }
  mouseClick(e: MouseEvent, frame: HTMLDivElement) {
    let height = frame.offsetHeight;
    let relativClick = e.offsetY;
    let MausY = (relativClick / height) * 100;

    this.top = MausY;
    this.left = e.clientX;
  }
}
