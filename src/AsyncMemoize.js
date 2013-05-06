var crypto = require('crypto');

module.exports = {

	cacheTable : {},

	memoize : function() {
		var me 			= this;
		var len 		= arguments.length;
		//callback should be the last parameter
		var callback 	= arguments[len-1];
		//Options should be the second-last parameter
		var options 	= arguments[len-2];
		//The function to run is the first paramter
		var fn 			= arguments[0];
		//Any parameters between the function and the options
		//are parameters that should be passed to the function.
		var fnArgs 		= [];

		for(var i = 1; i<len-2; i++) {
			fnArgs.push(arguments[i]);
		}

		var hash = this.getHashTableKey(fn, fnArgs);
		
		//Add a callback-proxy that caches the result
		//and the calls the original callback with the 
		//resulting arguments
		fnArgs.push(function() {
			me.addToCacheTable(hash, arguments, options);
			callback.apply(this, arguments);
		});

		var cached = me.getFromCacheTable(hash);
		
		//If we have a cached result - simply run the callback
		if(cached) {
			callback.apply(me, cached.args);
		}
		//Otherwise -> run the function with the callback-proxy
		else {
			fn.apply(me, fnArgs);
		}
	},

	/*
		Adds an element to the cache-table
		and sets the date for when it was added.
	*/
	addToCacheTable : function(hash, arguments, options) {
		this.cacheTable[hash] = {
			args : arguments,
			options : options || {timeout : 1000},
			added : new Date()
		};
	},

	/*
		Returns an element with the supplied
		hash-key, if it exists and it has not expired
	*/
	getFromCacheTable : function(hash) {
		var cached = this.cacheTable[hash];
		if(cached == null 
			|| cached.options == null 
			|| cached.options.timeout == null)
			return null;
		if(new Date() - cached.added > cached.options.timeout)
			return null;
		return cached;
	},

	/*
		Generates a hash-key that is a combination of 
		the function to run aswell as the arguments supplied.
	*/
	getHashTableKey : function(fn, fnArgs) {
		var md5sum = crypto.createHash('md5');
		md5sum.update(fn.toString());
		md5sum.update(fnArgs.toString());
		return md5sum.digest('hex');
	}
};