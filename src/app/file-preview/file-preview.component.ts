import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FilePreview } from './file-preview';

@Component({
  templateUrl: './file-preview.component.html',
  styleUrl: './file-preview.component.scss',
  standalone: true,
  imports: [PdfViewerModule, CommonModule, MatDialogModule],
})
export class FilePreviewComponent {
  @Input() file: File;
  isImage: boolean = false;
  fileSrc: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: FilePreview) {
    this.isImage = false;
    this.fileSrc = '';
    if (this.data.file) {
      this.getFileMimeType(this.data.file)
        .then((mimeType: string) => {
          if (mimeType.startsWith('image/')) {
            this.isImage = true;
            const reader = new FileReader();
            reader.onload = (event: any) => {
              this.fileSrc = event.target.result;
            };
            reader.readAsDataURL(this.data.file);
          } else if (mimeType === 'application/pdf') {
            let $img: any = document.querySelector('#file');
            if (typeof FileReader !== 'undefined') {
              let reader = new FileReader();
              reader.onload = (e: any) => {
                this.fileSrc = e.target.result;
              };
              reader.readAsArrayBuffer($img.files[0]);
            }
          }
        })
        .catch((error) =>
          console.error('Erro ao obter o tipo MIME do arquivo:', error)
        );
    }
  }
  getFileMimeType(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const arr = new Uint8Array(reader.result as ArrayBuffer).subarray(0, 4);
        let header = '';
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }

        // Mapear extensões de arquivo para tipos MIME
        const mimeType = {
          '89504e47': 'image/png',
          ffd8ffe0: 'image/jpeg',
          ffd8ffe1: 'image/jpeg',
          ffd8ffe2: 'image/jpeg',
          ffd8ffe3: 'image/jpeg',
          ffd8ffe8: 'image/jpeg',
          '25504446': 'application/pdf',
        };

        resolve(mimeType[header] || 'application/octet-stream');
      };

      reader.onerror = () => {
        reject('Erro ao ler o arquivo.');
      };

      reader.readAsArrayBuffer(file.slice(0, 4));
    });
  }
}