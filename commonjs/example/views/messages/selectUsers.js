var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Select Users for Message'] = function(evt) {
	var win = WindowManager.createWindow({
		backgroundColor: 'white'
	});
	var toSet = evt.toSet;

	var table = Ti.UI.createTableView({
		backgroundColor: '#fff',
		top: 0,
		bottom: 0,
		color: 'black',
		data: [{
			title: 'Loading, please wait...',
		}]
	});
	table.addEventListener('click', function(evt) {
		if (evt.row.id) {
			evt.row.hasCheck = !evt.row.hasCheck;
			if (evt.row.hasCheck) {
				toSet.ids.push(evt.row.id);
				toSet.names.push(evt.row.title);
			} else {
				var i = toSet.ids.indexOf(evt.row.id);
				toSet.ids.splice(i, 1);
				toSet.names.splice(i, 1);
			}
		}
	});
	win.add(table);

	function queryUsers() {
		Cloud.Users.query(function(e) {
			if (e.success) {
				if (e.users.length == 0) {
					table.setData([{
						title: 'No Users!'
					}]);
				} else {
					var data = [];
					for (var i = 0, l = e.users.length; i < l; i++) {
						var user = e.users[i];
						var row = Ti.UI.createTableViewRow({
							title: user.first_name + ' ' + user.last_name,
							id: user.id,
							color: 'black'
						});
						row.hasCheck = toSet.ids.indexOf(user.id) != -1;
						data.push(row);
					}
					table.setData(data);
				}
			} else {
				table.setData([{
					title: (e.error && e.message) || e
				}]);
				Utils.error(e);
			}
		});
	}

	win.addEventListener('open', function() {
		queryUsers();
	});
	return win;
};
