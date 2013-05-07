Async-Memoize
=============

## Memoizes an async function

Similar to http://underscorejs.org/#memoize  -> it memoizes the result of a function. However, instead of functions with a return-value:
```````
function fib(n) {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}
```````

It handles async-functions
````````
function asyncFunction(a, b, callback) {
  //Maybe some I/O here
  callback(a+b, b+a);
}

//Run and save asyncFunction for 1000 milliseconds
AsyncMemoize.memoize(asyncFunction, 1, 2, {timeout : 1000},function(a, b) {
    //a == 3, b == 3
});
````````

