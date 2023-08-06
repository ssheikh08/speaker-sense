import { ChangeDetectorRef, Component } from '@angular/core';
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
  selectedVideo: File | null = null; 
  showVideoPlayer: boolean = false;
  recognizedSpeech: any;
  uploadingFile: boolean = false; // Add this variable for the loading spinner

  constructor(private transcriptService: TranscriptService,
     public fileService: FileService, 
     private uploadService: UploadService,
     private http: HttpClient,
     private cdr: ChangeDetectorRef) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    
    if (file && this.isVideoFile(file)) {
      this.selectedVideo = null;
      this.showVideoPlayer = false;
      this.fileService.showRemoveButton = false;
      this.uploadingFile = true; // Start the loading spinner

      this.uploadService.getSignedUrl(file.name).subscribe(
        (response: any) => {
          this.uploadService.uploadFileToS3(response.signedUrl, file, file.type).subscribe(
            async (uploadResponse) => {
              console.log('File uploaded successfully:', uploadResponse);

              // Call the Lambda function to process video and get transcript key
              this.uploadService.processVideo(file.name).subscribe(
                (processResponse: any) => {
                  console.log('Transcript generation response:', processResponse.message);
                  this.recognizedSpeech = processResponse.message;

                  this.uploadingFile = false; // Stop the loading spinner
                  this.fileService.showRemoveButton = true;
                 this.fileService.selectedVideo = file;
                },
                (processError) => {
                  console.error('Error processing video:', processError);
                  this.uploadingFile = false; // Stop the loading spinner
                }
              );
            },
            (uploadError) => {
              console.error('Error uploading file:', uploadError);
              this.uploadingFile = false; // Stop the loading spinner
            }
          );
        },
        (error) => {
          console.error('Error getting signed URL:', error);
          this.uploadingFile = false; // Stop the loading spinner
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
    this.recognizedSpeech = null;
  }

  private isVideoFile(file: File): boolean {
    const allowedExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    return allowedExtensions.includes(fileExtension);
  }
}
