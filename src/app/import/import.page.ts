import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoadingController } from '@ionic/angular';

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
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
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

    const loading = await this.showLoading();

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const content = e.target?.result as string;
        const dataObject = JSON.parse(content);

        // Now you have the dataObject with keys 'childs' and 'schools'
        // You can use it as needed in your component.

        const schoolsData = dataObject.schools;
        const childsData = dataObject.childs;

        // Do something with the schools and childs data...
        console.log('Schools:', schoolsData);
        console.log('Childs:', childsData);

        loading.dismiss(); // Dismiss the loading spinner

      } catch (error) {
        console.error('Error parsing JSON file:', error);
        loading.dismiss(); // Dismiss the loading spinner in case of an error
      }
    };

    fileReader.readAsText(file);
  }

  private async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Processing file...',
      duration: 5000 // Set a duration or remove it if you want to dismiss manually
    });
    await loading.present();
    return loading;
  }
}
