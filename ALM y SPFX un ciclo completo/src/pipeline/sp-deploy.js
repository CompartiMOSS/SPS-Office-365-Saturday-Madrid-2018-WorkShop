const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
const sppkg = require('node-sp-alm');
const fs = require('fs');
const path = require('path');
const through = require('through2');
const debug = require('gulp-debug');
 
const environmentInfo = {
  "username": "",
  "password": "",
  "tenant": "[TENANT]",
  "absoluteUrl": "https://[TENANT].sharepoint.com/sites/spsmadrid18",
  "upgrade": false
}
 
exports.Task = build.task('sp-deploy', {
  execute: (config) => {      
    environmentInfo.username = config.args['username'] || environmentInfo.username;
    environmentInfo.password = config.args['password'] || environmentInfo.password;
    environmentInfo.tenant = config.args['tenant'] || environmentInfo.tenant;
    environmentInfo.absoluteUrl = config.args['absoluteUrl'] || environmentInfo.absoluteUrl;
    environmentInfo.upgrade = config.args['upgrade'] || environmentInfo.upgrade;

 
    return new Promise((resolve, reject) => {
      // Retrieve the package solution file
      const pkgFile = require('../config/package-solution.json');
      // Get the solution name from the package file
      const solutionFile = pkgFile.paths.zippedPackage;
      const fileLocation = `./sharepoint/${solutionFile}`;
      // Retrieve the file name, this will be used for uploading the solution package to the app catalog
      const fileName = solutionFile.split('/').pop();
      // Retrieve the skip feature deployment setting from the package solution config file
      const skipFeatureDeployment = pkgFile.solution.skipFeatureDeployment ? pkgFile.solution.skipFeatureDeployment : false;
 
      const spAlm = new sppkg.ALM({
        "username": environmentInfo.username,
        "password": environmentInfo.password,
        "tenant": environmentInfo.tenant,
        "absoluteUrl": environmentInfo.absoluteUrl,
        "verbose": true
      });
 
      // Get the solution file and pass it to the ALM module      
      return gulp.src(fileLocation).pipe(through.obj((file, enc, cb) => {

        spAlm.add(fileName, file.contents, true, false).then(data => {
          build.log('Solution package added');
          const packageId = data.UniqueId;

          spAlm.deploy(packageId, skipFeatureDeployment, false).then(data => {
            build.log('Solution package deployed');

            build.log('Upgrade action: ' + environmentInfo.upgrade)
            if (!environmentInfo.upgrade) {
              spAlm.install(packageId).then(data => {
                build.log('Solution installed');
                cb(null, file);
              });
            } else {
              spAlm.upgrade(packageId).then(data => {
                build.log('Solution upgraded');
                cb(null, file);
              });
            }
          });
        });
      })).on('finish', resolve);
    });
  }
});