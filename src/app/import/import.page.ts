import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LocalStorageService } from '../services/localstorage.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.page.html',
  styleUrls: ['./import.page.scss'],
})
export class ImportPage implements OnInit {
  fileSelected: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private loadingController: LoadingController,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
    private _storage: LocalStorageService
  ) {}

  ngOnInit() {}

  onFileSelected(event: any) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    console.log(file);
    if (file) {
      this.fileSelected = true;
      this.selectedFile = file;
    } else {
      this.fileSelected = false;
      this.selectedFile = null;
    }

    this.cdr.detectChanges(); // Manually trigger change detection
  }

  async onSubmit() {
    if (this.fileSelected && this.selectedFile) {
      await this.readFile(this.selectedFile);
    } else {
      console.warn('No file selected. Form not submitted.');
    }
  }

  private async readFile(file: File) {
    const fileReader = new FileReader();
    console.log('file', file);
    const loading = await this.showLoading();

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      console.log('inside onload');
      console.log('content', e.target?.result as string);
      try {
        const content = e.target?.result as string;
        const dataObject = JSON.parse(content);

        const schoolsData = dataObject.schools;
        const childsData = dataObject.childs;

        console.log('Schools:', schoolsData);
        console.log('Childs:', childsData);

        this._storage.setItem('schools', schoolsData);
        this._storage.setItem('childs', childsData);

        loading.dismiss(); // Dismiss the loading spinner
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        loading.dismiss(); // Dismiss the loading spinner in case of an error
      }
    };

    fileReader.onerror = (e: ProgressEvent<FileReader>) => {
      console.error('Error reading file:', e.target?.error);
      loading.dismiss(); // Dismiss the loading spinner in case of an error
    };

    // Add a timeout to dismiss the loading spinner if FileReader is not triggering events.
    setTimeout(() => {
      console.log('FileReader did not trigger events. Dismissing loading...');
      loading.dismiss();
    }, 5000); // 5 seconds timeout

    fileReader.readAsText(file);
  }

  private async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Processing file...',
    });
    await loading.present();
    return loading;
  }
}
