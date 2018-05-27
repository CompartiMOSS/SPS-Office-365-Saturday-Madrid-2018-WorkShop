'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

//gulp sp-deploy --username "luis@inheritscloud.com" --password "XXXXX" --tenant "inheritscloud" --absoluteUrl "https://inheritscloud.sharepoint.com/sites/spsmadrid18"
require('./pipeline/sp-deploy.js');

build.initialize(gulp);
