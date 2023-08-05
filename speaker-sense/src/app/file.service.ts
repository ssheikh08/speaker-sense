import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  selectedVideo: File | null = null;
  showVideoPlayer: boolean = false;
  showRemoveButton: boolean = false;
  isVideoShown: boolean = false;
}

