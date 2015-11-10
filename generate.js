
var fs = require('fs');
var util = require('util');
var exec = require('child_process').exec;

var _ = require('underscore');

var columns = 10;

//UGH!
//Ugly format Apple ;)
// https://developer.apple.com/library/prerelease/ios/documentation/Swift/Conceptual/Swift_Programming_Language/LexicalStructure.html#//apple_ref/swift/grammar/operator-head

var legalOperatorHeads = [
	['A1', 'A7'],
	'A9', 'AB', 'AC', 'AE',
	['B0', 'B1'],
	'B6', 'BB', 'BF', 'D7', 'F7',
	['2016', '2017'],
	['2020', '2027'],
	['2030', '203E'],
	['2041', '2053'],
	['2055', '205E'],
	['2190', '23FF'],
	['2500', '2775'],
	['2794', '2BFF'],
	['2E00', '2E7F'],
	['3001', '3003'],
	['3008', '3030']
];

var legalOperatorCharacters = [
	['300', '36F'],
	['1DC0', '1DFF'],
	['20D0', '20FF'],
	['FE00', 'FE0F'],
	['FE20', 'FE2F'],
	['E0100', 'E01EF']
];

function hexStringToNum (hexString) {
	hexString = hexString || '0';
	while (hexString.length < 4) {//probably not necessary?
		hexString = '0' + hexString;
	}
	return Number('0x' + hexString);
}

function extractAllNumbers(sets) {
	var allNumbers = [];
	sets.forEach(function (el) {
		if (!_.isArray(el)) {
			allNumbers.push(hexStringToNum(el));
			return;
		}
		var begin = hexStringToNum(el[0]);
		var end =hexStringToNum(el[1]);
		for (var i = begin; i <= end; i++) {
			allNumbers.push(i);
		}
	});
	return allNumbers;
}

function numbersToCharacters (nums) {
	return _.map(nums, function (num) {
		return String.fromCharCode(num);
	});
}

function allLegalOperatorHeadCharacters () {
	var allNums = extractAllNumbers(legalOperatorHeads);
	var allChars = numbersToCharacters(allNums);
	return '/=-+!*%<>&|^~?'.split('').concat(allChars);
}

function justLegalOperatorCharacters () {
	var allNums = extractAllNumbers(legalOperatorCharacters);
	return numbersToCharacters(allNums);
}

function tabSeparateElements(elements, numColumns) {
	var i = 0;
	var desc = '';
	_.each(elements, function (el) {
		i += 1;
		var join = (i % numColumns) ? '\t' : '\n';
		desc += el + join;
	});
	return desc;
}

var operatorHeadCharacters = tabSeparateElements(allLegalOperatorHeadCharacters(), columns);
var operatorCharacters = tabSeparateElements(justLegalOperatorCharacters(), columns);

var templateFile = __dirname + '/template.html';
var htmlDestination = __dirname + '/index.html';

fs.readFile(templateFile, function (error, data) {
	var template = data + '';
	var toWrite = util.format(template, operatorHeadCharacters, operatorCharacters);
	fs.writeFile(htmlDestination, toWrite, function () {
		exec('open ' + htmlDestination);
	});
});


