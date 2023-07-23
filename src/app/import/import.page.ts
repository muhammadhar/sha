import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../services/localstorage.service';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-import',
  templateUrl: './import.page.html',
  styleUrls: ['./import.page.scss'],
})
export class ImportPage implements OnInit {
  fileSelected = false;
  selectedFile: any | undefined;

  constructor(
    private _storage: LocalStorageService,
    private plt: Platform,
    private router: Router
  ) {}

  ngOnInit() {}

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.fileSelected = true;
      this.selectedFile = inputElement.files[0];
    } else {
      this.fileSelected = false;
      this.selectedFile = undefined;
    }
  }

  async onSubmit() {
    if (!this.selectedFile) {
      console.error('No file selected.');
      return;
    }

    try {
      if (this.plt.is('cordova')) {
        const fileContent = await this.readFileAsText(this.selectedFile);
        // console.log('File content:', fileContent);
        const fileData = JSON.parse(fileContent);
        this.checkAndStoreData(fileData);
      } else {
        const fileContent = await this.readFileAsJSONOnWeb(this.selectedFile);
        this.checkAndStoreData(fileContent);
      }
      alert('data imported successfully');
      this.router.navigate(['/members/dashboard']);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }

  private readFileAsText(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let fileReader = new FileReader();

      // Get the original real FileReader. The polyfill saves a reference to it.
      const realFileReader = fileReader['_realReader'];

      // Make sure we were able to get the original FileReader
      if (realFileReader) {
        // Swap out the polyfill instance for the original instance.
        fileReader = realFileReader;
      }

      fileReader.onload = () => {
        const fileContent = fileReader.result as string;
        resolve(fileContent);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };

      fileReader.readAsText(file);
    });
  }

  private checkAndStoreData(dataObject: any) {
    // Check if schools and children exist in localStorage
    const schoolsData = localStorage.getItem('schools');
    const childsData = localStorage.getItem('childs');

    if (!schoolsData) {
      // If schools data does not exist in localStorage, store the imported data directly
      this._storage.setItem('schools', dataObject.schools);
    } else {
      // Get the existing schools data from localStorage
      const existingSchools = JSON.parse(schoolsData) || [];

      // Merge schools with existing data in localStorage
      dataObject.schools.forEach((school: any) => {
        const existingSchool = existingSchools.find(
          (item: any) => item.name === school.name
        );
        if (!existingSchool) {
          existingSchools.push(school);
        }
      });

      console.log('Merged Schools:', existingSchools);

      // Save the merged schools data back to localStorage
      this._storage.setItem('schools', existingSchools);
    }

    if (!childsData) {
      // If children data does not exist in localStorage, store the imported data directly
      this._storage.setItem('childs', dataObject.childs);
    } else {
      // Get the existing children data from localStorage
      const existingChilds = JSON.parse(childsData) || [];

      // Merge children with existing data in localStorage
      dataObject.childs.forEach((child: any) => {
        const existingChildIndex = existingChilds.findIndex(
          (item: any) => item.id === child.id
        );

        if (existingChildIndex === -1) {
          // Child does not exist in existingChilds, so add it
          existingChilds.push(child);
        } else {
          // Child exists in existingChilds, so update relevant fields
          existingChilds[existingChildIndex].childName = child.childName;
          existingChilds[existingChildIndex].fatherName = child.fatherName;
          existingChilds[existingChildIndex].motherName = child.motherName;
          existingChilds[existingChildIndex].dateOfBirth = child.dateOfBirth;
          existingChilds[existingChildIndex].selectedSchool =
            child.selectedSchool;
          existingChilds[existingChildIndex].gender = child.gender;
          existingChilds[existingChildIndex].email = child.email;
          existingChilds[existingChildIndex].whatsappNumber =
            child.whatsappNumber;
          existingChilds[existingChildIndex].earWax = child.earWax;
          existingChilds[existingChildIndex].vision = child.vision;
          existingChilds[existingChildIndex].palmarPallor = child.palmarPallor;
          existingChilds[existingChildIndex].hygiene = child.hygiene;
          existingChilds[existingChildIndex].carries = child.carries;
          existingChilds[existingChildIndex].scaling = child.scaling;
          existingChilds[existingChildIndex].gaps = child.gaps;
          existingChilds[existingChildIndex].chickenpox = child.chickenpox;
          existingChilds[existingChildIndex].hepatitisA = child.hepatitisA;
          existingChilds[existingChildIndex].mmr = child.mmr;
          existingChilds[existingChildIndex].meningitis = child.meningitis;
          existingChilds[existingChildIndex].typhoid = child.typhoid;
          existingChilds[existingChildIndex].epiStatus = child.epiStatus;
          // Update other relevant fields here as needed

          // Merge visits array
          child.visits.forEach((visit: any) => {
            const matchingVisit = existingChilds[
              existingChildIndex
            ].visits.find((item: any) => item.date === visit.date);
            if (!matchingVisit) {
              existingChilds[existingChildIndex].visits.push(visit);
            }
          });

          // Merge lastFiveVisits array
          child.lastFiveVisits.forEach((lastFiveVisit: any) => {
            const matchingLastFiveVisit = existingChilds[
              existingChildIndex
            ].lastFiveVisits.find(
              (item: any) => item.date === lastFiveVisit.date
            );
            if (!matchingLastFiveVisit) {
              existingChilds[existingChildIndex].lastFiveVisits.push(
                lastFiveVisit
              );
            }
          });
        }
      });

      console.log('Merged Children:', existingChilds);

      // Save the merged children data back to localStorage
      this._storage.setItem('childs', existingChilds);
    }
  }

  async readFileAsJSONOnWeb(file: File): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const jsonData = JSON.parse(reader.result as string);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsText(file);
    });
  }
}
