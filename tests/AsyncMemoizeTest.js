var 
	AsyncMemoize = require('../src/AsyncMemoize');

module.exports = {
	testMemoizeCallback : function(test) {
		test.expect(5);
		
		/*
			A function that might do some i/o, and then
			executes a callback with the supplied input
		*/
		function functionToMemoize(parameter1, parameter2, callback) {
			test.ok(true, 'This function should run once');
			callback(parameter1, parameter2);
		};

		var p1 = "param1";
		var p2 = "param2";

		//This should result in a cache-miss, and the "functionToMemoize" should run.
		AsyncMemoize.memoize(functionToMemoize, p1, p2, {timeout : 100}, function(parameter1, parameter2) {
			test.equal(parameter1, p1);
			test.equal(parameter2, p2);
			//This should result in a cache-hit
			AsyncMemoize.memoize(functionToMemoize, p1, p2, {timeout : 100}, function(parameter1, parameter2) {
				test.equal(parameter1, p1);
				test.equal(parameter2, p2);
				test.done();
			});
		});

	}
};