function toJson() {
	try {
		let sqlText = $('#sql').val();
		let rows = sqlText.split('\n');
		let title = rows[1];
		let properties = title.split('|').slice(1, title.split('|').length - 1);
		properties = properties.map(prop => prop.trim());
		rows = rows.slice(3, rows.length - 2)

		let jsonValue = []

		for (let j = 0 ; j < rows.length ; j += 1) {
			let row = rows[j];
			let values = row.split('|').slice(1, row.split('|').length - 1);
			values = values.map(value => value.trim());
			let tempObj = {}

			for (let i = 0 ; i < properties.length ; i += 1) {
				tempObj[properties[i]] = values[i];
			}

			jsonValue.push(tempObj);
		}

		$('#json').val(JSON.stringify(jsonValue, null, 2));
	} catch(err) {
		$('#json').val('An error has occurred');
	}
}

function getColumnsWidth(jsonArray) {
	let columnsWidth = [];

		let item = jsonArray[0];

		for (let i = 0 ; i < Object.keys(item).length ; i += 1) {
			columnsWidth[i] = Object.keys(item)[i].length;
		}

		for (let i = 0 ; i < jsonArray.length ; i += 1) {
			for (let j = 0 ; j < Object.keys(item).length ; j += 1) {
				if (jsonArray[i][Object.keys(item)[j]].length > columnsWidth[j]) {
					columnsWidth[j] = jsonArray[i][Object.keys(item)[j]].length;
				}				
			}
		}

	return columnsWidth;
}

function getSeperator(columnsWidth) {
	let strings = [];
	strings.push('');

	for (let i = 0 ; i < columnsWidth.length ; i += 1) {
		strings.push(''.padEnd(columnsWidth[i] + 2, '-'));
	}

	strings.push('');

	return strings.join('+') + '\n';
}

function makeLine(line, columnsWidth) {
	let strings = [];
	strings.push('');

	for (let i = 0 ; i < Object.values(line).length ; i += 1) {
		strings.push(' ' + Object.values(line)[i].padEnd(columnsWidth[i], ' ') + ' ');
	}

	strings.push('');

	return strings.join('|') + '\n';
}

function makeTitleLine(columnNames, columnsWidth) {
	let strings = [];
	strings.push('');

	for (let i = 0 ; i < columnNames.length ; i += 1) {
		strings.push(' ' + columnNames[i].padEnd(columnsWidth[i], ' ') + ' ');
	}

	strings.push('');

	return strings.join('|') + '\n';
}

function toSQL() {
	try {
		let jsonText = $('#json').val();

		if (jsonText.length === 0) {
			$('#sql').val('You entered an empty JSON, please input a JSON array');
		}

		let jsonArray = JSON.parse(jsonText);

		if (!(Array.isArray(jsonArray))) {
			$('#sql').val('The JSON text you entered is not an array, please input a JSON array');
		}

		let columnsWidth = getColumnsWidth(jsonArray);

		let seperator = getSeperator(columnsWidth);

		let sqlOutputString = seperator + makeTitleLine(Object.keys(jsonArray[0]), columnsWidth) + seperator;
		

		for (let i = 0 ; i < jsonArray.length ; i += 1) {
			sqlOutputString += makeLine(jsonArray[i], columnsWidth);
		}

		$('#sql').val(sqlOutputString + seperator);

	} catch(err) {
		$('#sql').val('An error has occurred');
	}
}

function sqlToClipboard() {
	let copyText = document.getElementById('sql');
	copyText.select();
	document.execCommand('copy');
	clearSelection();
}

function jsonToClipboard() {
	let copyText = document.getElementById('json');
	copyText.select();
	document.execCommand('copy');
	clearSelection();
}

function compactJson() {
	if ($('#json').val().length > 0)
		$('#json').val(JSON.stringify(JSON.parse($('#json').val())));
}

function prettifyJson() {
	if ($('#json').val().length > 0)
		$('#json').val(JSON.stringify(JSON.parse($('#json').val()), null, 2));
}

function clearSelection()
{
	if (window.getSelection) {
		window.getSelection().removeAllRanges();
	} else if (document.selection) {
		document.selection.empty();
	}
}


