import { Component, OnInit } from '@angular/core';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-export',
  templateUrl: './export.page.html',
  styleUrls: ['./export.page.scss'],
})
export class ExportPage implements OnInit {
  constructor(private platform: Platform, private file: File) {}

  ngOnInit() {}
  exportData() {
    const schoolsData = localStorage.getItem('schools');
    const childsData = localStorage.getItem('childs');

    const dataObject = {
      schools: JSON.parse(schoolsData),
      childs: JSON.parse(childsData),
    };

    const jsonData = JSON.stringify(dataObject);
    const fileName = 'data_export.json';

    if (this.platform.is('cordova')) {
      // Save the JSON file on the device using @awesome-cordova-plugins/file
      this.saveFileToDevice(jsonData, fileName);
    } else {
      // For non-Cordova platforms (e.g., web), trigger the download
      this.downloadFile(jsonData, fileName);
    }
  }

  // Function to save the JSON file on the device using @awesome-cordova-plugins/file
  private saveFileToDevice(jsonData: string, fileName: string) {
    const directory = this.file.dataDirectory; // Use the dataDirectory from @awesome-cordova-plugins/file
    this.file
      .writeFile(directory, fileName, jsonData, { replace: true })
      .then(() => {
        const filePath = directory + fileName;
        SocialSharing.share(
          undefined,
          undefined,
          filePath,
          'json file downloaded successfully'
        )
          .then(() => {
            console.log('json file downloaded successfully".');
          })
          .catch((error: any) => {
            console.error('Error sharing Json file:', error);
          });
      })
      .catch((error) => {
        console.error('Error saving file:', error);
      });
  }

  // Function to trigger the download for non-Cordova platforms (e.g., web)
  private downloadFile(jsonData: string, fileName: string) {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    // Optionally, you can revoke the object URL after the download link is clicked.
    URL.revokeObjectURL(url);
  }

  async getNativeUrlForFile(filePath: string): Promise<string> {
    try {
      const resolvedUrl = await this.file.resolveLocalFilesystemUrl(filePath);
      return resolvedUrl.toURL();
    } catch (error) {
      console.error('Error resolving file URL:', error);
      return '';
    }
  }
}
