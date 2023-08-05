import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoUploadComponent } from './video-upload/video-upload.component';
import { TranscriptDisplayComponent } from './transcript-display/transcript-display.component';
import { TranscriptService } from './transcript.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnalyticsPresentationComponent } from './analytics-presentation/analytics-presentation.component';
import { FileService } from './file.service';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    VideoUploadComponent,
    TranscriptDisplayComponent,
    AnalyticsPresentationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [TranscriptService, FileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
