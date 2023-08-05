import { Component } from '@angular/core';
import { TranscriptService } from '../transcript.service'; 
import { FileService } from '../file.service';
import { UploadService } from '../upload.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.css']
})


export class VideoUploadComponent {
  selectedVideo: File | null = null; // Initialize as null
  showVideoPlayer: boolean = false;

  constructor(private transcriptService: TranscriptService,
     public fileService: FileService, 
     private uploadService: UploadService,
     private http: HttpClient) {}
  

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.fileService.selectedVideo = file;
    if (file && this.isVideoFile(file)) {
      this.selectedVideo = file;
      this.showVideoPlayer = false; // Hide video player when a new file is selected
      this.fileService.showRemoveButton = true;
      // Assume you have transcriptLines, set them in the service

      this.uploadService.getSignedUrl(file.name).subscribe(
        (response: any) => {
          // Use the signed URL to upload the file
          this.uploadService.uploadFileToS3(response.signedUrl, file, file.type).subscribe(
            uploadResponse => {
              console.log('File uploaded successfully:', uploadResponse);
              // Additional logic after successful upload
            },
            uploadError => {
              console.error('Error uploading file:', uploadError);
            }
          );
        },
        error => {
          console.error('Error getting signed URL:', error);
        }
      );
    } else {
      console.log('Please select a valid video file.');
    }
  }

  showVideo() {
    this.fileService.showVideoPlayer = true;
    this.fileService.isVideoShown = true;
  }

  hideVideo(){
    this.fileService.showVideoPlayer = false;
    this.showVideoPlayer = false;
    this.fileService.isVideoShown = false;
  }

  toggleVideoPlayer() {
    this.showVideoPlayer = !this.showVideoPlayer;
  }

  removeFile(fileInput: any) {
    this.fileService.selectedVideo = null;
    this.fileService.showVideoPlayer = false;
    this.fileService.showRemoveButton = false;
    this.fileService.isVideoShown = false;
    fileInput.value = null; // Reset the file input
  }

  private isVideoFile(file: File): boolean {
    const allowedExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    return allowedExtensions.includes(fileExtension);
  }
  
}
