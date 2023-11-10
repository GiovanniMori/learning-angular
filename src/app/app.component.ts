import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FilePreviewComponent } from './file-preview/file-preview.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  file: File;
  showFilePreview: boolean = false;
  constructor(public dialog: MatDialog) {}
  onFileSelected(event: any): void {
    this.file = event.target.files[0];
    this.showFilePreview = false;
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.showFilePreview = true;
    }
  }
  openDialog() {
    this.dialog.open(FilePreviewComponent, {
      data: {
        file: this.file,
      },
    });
  }
}
