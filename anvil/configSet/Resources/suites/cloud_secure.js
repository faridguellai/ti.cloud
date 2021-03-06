/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function () {
	var finish;
	var valueOf;
	var Cloud;
	this.init = function (testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		Cloud = require('ti.cloud');
	};

	this.name = "cloud secure";

	// ---------------------------------------------------------------
	// Cloud
	// ---------------------------------------------------------------

	// Test that cloud module is part of TiSDK
	this.testModule = function (testRun) {
		// Verify that the module is defined
		valueOf(testRun, Cloud).shouldBeObject();
		finish(testRun);
	};

	// Test the usage of the useSecure property
	this.testUseSecure = function (testRun) {
		// Verify default value of useSecure
		valueOf(testRun, Cloud.useSecure).shouldBeUndefined();
		// Verify useSecure property changes
		Cloud.useSecure = false;
		valueOf(testRun, Cloud.useSecure).shouldBeFalse();
		// Verify useSecure resets
		Cloud.useSecure = true;
		valueOf(testRun, Cloud.useSecure).shouldBeTrue();
		finish(testRun);
	};

	this.testEnsureSetup = function (testRun) {
		var loggedOut2 = function (e) {
			valueOf(testRun, e.success).shouldBeTrue();
			finish(testRun);
		};

		var created2 = function (e) {
			valueOf(testRun, e.success).shouldBeTrue();
			valueOf(testRun, e.error).shouldBeFalse();
			Cloud.Users.logout(loggedOut2);
		};

		var login2 = function (e) {
			if (e.success == false) {
				var data = {
					title: "chatuser"
				};
				Cloud.Users.secureCreate(data, created1);
			} else {
				created2(e);
			}
		};

		var loggedOut1 = function (e) {
			valueOf(testRun, e.success).shouldBeTrue();
			Cloud.Users.secureLogin({
				title: "chatuser"
			}, login2);
		};

		var created1 = function (e) {
			valueOf(testRun, e.success).shouldBeTrue();
			valueOf(testRun, e.error).shouldBeFalse();
			Cloud.Users.logout(loggedOut1);
		};

		var login1 = function (e) {
			if (e.success == false) {
				var data = {
					title: "drillbituser"
				};
				Cloud.Users.secureCreate(data, created1);
			} else {
				created1(e);
			}
		};

		Cloud.Users.secureLogin({
			title: "drillbituser"
		}, login1);
	};

	// Populate the array of tests based on the 'hammer' convention
	this.tests = require('hammer').populateTests(this, 30000);
};
