import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranscriptService {
  private transcriptData: string[] = [];

  setTranscript(transcriptLines: string[]) {
    this.transcriptData = transcriptLines;
  }

  getTranscript(): string[] {
    return this.transcriptData;
  }
}
