var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Query Files'] = function(evt) {
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
				target: 'Show File',
				id: evt.row.id
			});
		}
	});
	win.add(table);

	win.addEventListener('open', function() {
		Cloud.Files.query(function(e) {
			if (e.success) {
				if (e.files.length == 0) {
					table.setData([{
						title: 'No Files!'
					}]);
				} else {
					var data = [];
					for (var i = 0, l = e.files.length; i < l; i++) {
						data.push(Ti.UI.createTableViewRow({
							title: e.files[i].name,
							id: e.files[i].id
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
