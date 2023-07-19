import { Component, OnInit } from '@angular/core';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { Platform } from '@ionic/angular';
import { InAppBrowser, InAppBrowserObject } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-export',
  templateUrl: './export.page.html',
  styleUrls: ['./export.page.scss'],
})
export class ExportPage implements OnInit {

  constructor(private platform: Platform, private file: File, private iab:InAppBrowser) { }

  ngOnInit() {
  }
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
    this.file.writeFile(directory, fileName, jsonData, { replace: true }).then(() => {
      // File saved successfully, now open it using InAppBrowser plugin
      const browser: InAppBrowserObject = this.iab.create(directory + fileName, '_blank');
      browser.show();
    }).catch((error) => {
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

}
