import { Component, Input } from '@angular/core';
import { TranscriptService } from '../transcript.service'; 

@Component({
  selector: 'app-transcript-display',
  templateUrl: './transcript-display.component.html',
  styleUrls: ['./transcript-display.component.css']
})
export class TranscriptDisplayComponent {
  @Input() transcriptLines: string[] = [];

  constructor(private transcriptService: TranscriptService) {}

  ngOnInit() {
    this.transcriptLines = this.transcriptService.getTranscript();
  }
}
