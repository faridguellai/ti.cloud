var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Query User'] = function(evt) {
	var win = WindowManager.createWindow({
		backgroundColor: 'white'
	});

	var table = Ti.UI.createTableView({
		backgroundColor: '#fff',
		top: 0,
		bottom: 0,
		color: 'black',
		data: [{
			title: 'Loading, please wait...'
		}]
	});
	table.addEventListener('click', function(evt) {
		if (evt.row.id) {
			WindowManager.handleOpenWindow({
				target: 'Show User',
				id: evt.row.id
			});
		}
	});
	win.add(table);

	win.addEventListener('open', function() {
		Cloud.Users.query(function(e) {
			if (e.success) {
				if (e.users.length == 0) {
					table.setData([{
						title: 'No Results!'
					}]);
				} else {
					var data = [];
					for (var i = 0, l = e.users.length; i < l; i++) {
						data.push(Ti.UI.createTableViewRow({
							title: e.users[i].first_name + ' ' + e.users[i].last_name,
							id: e.users[i].id,
							color : 'black'
						}));
					}
					table.setData(data);
				}
			} else {
				Utils.error(e);
			}
		});
	});
	return win;
};
