import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoUploadComponent } from './video-upload/video-upload.component';
import { TranscriptDisplayComponent } from './transcript-display/transcript-display.component';
import { AnalyticsPresentationComponent } from './analytics-presentation/analytics-presentation.component';

const routes: Routes = [
  { path: '', redirectTo: '/video-upload', pathMatch: 'full' }, // Redirect to video-upload on empty path
  { path: 'video-upload', component: VideoUploadComponent },
  { path: 'transcript-display', component: TranscriptDisplayComponent },
  { path: 'analytics-presentation', component: AnalyticsPresentationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
