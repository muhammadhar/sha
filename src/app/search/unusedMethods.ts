// createAndWriteCSVFile(child: IChild) {
//   const fileName = child.childName + 'data.csv';

//   const csvString = this.convertObjectToCSV(child);

//   const dataDirectory = this.file.dataDirectory;

//   this.file
//     .writeFile(dataDirectory, fileName, csvString, { replace: true })
//     .then(() => {
//       alert(
//         'child ' +
//           child.childName +
//           ' csv file downloaded successfully to: ' +
//           dataDirectory +
//           fileName
//       );

//       // Open the CSV file
//       this.fileOpener
//         .open(dataDirectory + fileName, 'text/csv')
//         .then(() => {
//           console.log('CSV file opened successfully.');
//         })
//         .catch((error: any) => {
//           console.error('Error opening CSV file:', error);
//         });
//     })
//     .catch((error: any) => {
//       console.error('Error creating and writing CSV file:', error);
//     });
// }

//android.permission nt working....
// async checkPermissions(child: IChild) {
//   try {
//     const writePermission = await this.androidPermissions.checkPermission(
//       this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
//     );

//     if (writePermission.hasPermission) {
//       // Write permission is granted
//       console.log('Write permission granted on', this.getPlatformName());
//       await this.checkReadPermission();
//       this.createAndWriteCSV(child);
//     } else {
//       // Write permission is not granted, request it
//       const writePermissionRequest =
//         await this.androidPermissions.requestPermission(
//           this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE
//         );
//       if (writePermissionRequest.hasPermission) {
//         // Write permission granted after request
//         console.log('Write permission granted on', this.getPlatformName());
//         this.checkReadPermission();
//       } else {
//         // Write permission denied
//         console.log('Write permission denied on', this.getPlatformName());
//       }
//     }
//   } catch (error) {
//     console.error('Error checking or requesting write permission:', error);
//   }
// }

// async checkReadPermission() {
//   try {
//     const readPermission = await this.androidPermissions.checkPermission(
//       this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
//     );

//     if (readPermission.hasPermission) {
//       // Read permission is granted
//       console.log('Read permission granted on', this.getPlatformName());
//     } else {
//       // Read permission is not granted, request it
//       const readPermissionRequest =
//         await this.androidPermissions.requestPermission(
//           this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
//         );
//       if (readPermissionRequest.hasPermission) {
//         // Read permission granted after request
//         console.log('Read permission granted on', this.getPlatformName());
//       } else {
//         // Read permission denied
//         console.log('Read permission denied on', this.getPlatformName());
//       }
//     }
//   } catch (error) {
//     console.error('Error checking or requesting read permission:', error);
//   }
// }

// async checkPermissions(child: IChild) {
//   try {
//     const permission = await this.androidPermissions.checkPermission(
//       this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE
//     );

//     if (permission.hasPermission) {
//       // Permission is granted
//       console.log('Manage external storage permission granted on', this.getPlatformName());
//       this.createAndWriteCSV(child);
//     } else {
//       // Permission is not granted, request it
//       const permissionRequest = await this.androidPermissions.requestPermission(
//         this.androidPermissions.PERMISSION.MANAGE_EXTERNAL_STORAGE
//       );

//       if (permissionRequest.hasPermission) {
//         // Permission granted after request
//         console.log('Manage external storage permission granted on', this.getPlatformName());
//         this.createAndWriteCSV(child);
//       } else {
//         // Permission denied
//         console.log('Manage external storage permission denied on', this.getPlatformName());
//       }
//     }
//   } catch (error) {
//     console.error('Error checking or requesting manage external storage permission:', error);
//   }
// }
