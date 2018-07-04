/** 
 * JSON Data for use in Functional Programming blog example 
 * See related blog series at: http://www.datchley.name/tag/functional-programming/
 */

var records = [
  {
    "id": 1,
    "title": "Currying Things",
    "author": "Dave",
    "selfurl": "/posts/1",
    "published": 1437847125528,
    "tags": [
      "functional programming"
    ],
    "displayDate": "2015-07-25"
  },
  {
    "id": 2,
    "title": "ES6 Promises",
    "author": "Kurt",
    "selfurl": "/posts/2",
    "published": 1437926509394,
    "tags": [
      "es6",
      "promises"
    ],
    "displayDate": "2015-07-26"
  },
  {
    "id": 3,
    "title": "Monads, Futures, Promises",
    "author": "Beth",
    "selfurl": "/posts/3",
    "published": 1429984725528,
    "tags": [
      "promises",
      "futures"
    ],
    "displayDate": "2015-04-25"
  },
  {
    "id": 4,
    "title": "Basic Destructuring in ES6",
    "author": "Angie",
    "selfurl": "/posts/4",
    "published": 1433606509394,
    "tags": [
      "es6",
      "destructuring"
    ],
    "displayDate": "2015-06-06"
  },
  {
    "id": 5,
    "title": "Composing Functions",
    "author": "Tom",
    "selfurl": "/posts/5",
    "published": 1429034325528,
    "tags": [
      "functional programming"
    ],
    "displayDate": "2015-04-14"
  },
  {
    "id": 6,
    "title": "Lazy Sequences in FP",
    "author": "Dave",
    "selfurl": "/posts/6",
    "published": 1434902509394,
    "tags": [
      "functional programming"
    ],
    "displayDate": "2015-06-21"
  },
  {
    "id": 7,
    "title": "Common Promise Idioms",
    "author": "Kurt",
    "selfurl": "/posts/7",
    "published": 1438876909394,
    "tags": [
      "es6",
      "promises"
    ],
    "displayDate": "2015-08-06"
  },
  {
    "id": 8,
    "title": "Stop using Deferred",
    "author": "Dave",
    "selfurl": "/posts/8",
    "published": 1435773701255,
    "tags": [
      "promises",
      "futures"
    ],
    "displayDate": "2015-07-01"
  },
  {
    "id": 9,
    "title": "Default Function Parameters in ES6",
    "author": "Angie",
    "selfurl": "/posts/9",
    "published": 1436205701255,
    "tags": [
      "es6",
      "destructuring"
    ],
    "displayDate": "2015-07-06"
  },
  {
    "id": 10,
    "title": "Use more Parenthesis!",
    "author": "Tom",
    "selfurl": "/posts/10",
    "published": 1440604909394,
    "tags": [
      "functional programming"
    ],
    "displayDate": "2015-08-26"
  }
];


/**
 * A small functional library used in my series of blog posts on functional programming
 * See related blog series at: http://www.datchley.name/tag/functional-programming/
 * http://datchley.name/
 * Version: 2.0 
 */

// Utility short-hand functions
var slice = Array.prototype.slice,
    join = Array.prototype.join,
    concat = Array.prototype.concat,
    keys = Object.keys,
    toString = Object.prototype.toString,
    isString = function(o){ return toString.call(o) == '[object String]'; },
    isArray = function(o) { return toString.call(o) == '[object Array]'; },
    isFunction = function(o) { return toString.call(o) == '[object Function]'; };
 
// Returns a new function
// that calls the original function with arguments reversed.
function flip(fn) {
    return function() {
        var args = slice.call(arguments);
        return fn.apply(this, args.reverse());
    };
}

// Returns a curried version of the function `fn`, with arguments
// curried from right -> left.  Uses the natural arity of `fn` to
// determine how many arguments to curry, or `n` if passed.
function rightCurry(fn, n) {  
  var arity = n || fn.length,
      fn = flip(fn);
  return function curried() {
      var args = slice.call(arguments), 
          context = this;

      return args.length >= arity ?
          fn.apply(context, args.slice(0, arity)) : 
          function () {
              var rest = slice.call(arguments);
              return curried.apply(context, args.concat(rest));
          };
  };
}

// Access the `obj` using the property `prop`
function get(obj, prop) {
    return obj[prop];
}

// Given a list of objects, return a list of the values
// for property 'prop' in each object
function pluck(list, prop) {
  return mapWith(getWith(prop))(list);
}

// Filter `list` using the predicate function `fn`
function filter(list, fn) {
  return list.filter(fn);
}

// Returns an object which groups objects in `list` by property `prop`. If
// `prop` is a function, will group the objects in list using the string returned
// by passing each obj through `prop` function.
function group(list, prop) {
  return list.reduce(function(grouped, item) {
      var key = isFunction(prop) ? prop.apply(this, [item]) : item[prop];
      grouped[key] = grouped[key] || [];
      grouped[key].push(item);
      return grouped;
  }, {});
}

// Returns a new list by applying the function `fn` to each item
// in `list`
function map(list, fn) {
  return list.map(fn);
}

// Returns a new object which is the result of mapping
// each *own* `property` of `obj` through function `fn`
function mapObject(obj, fn) {
  return keys(obj).reduce(function(res, key) {
    res[key] = fn.apply(this, [key, obj[key]]);
    return res;
  }, {});
}

// Return new list as combination of the two lists passed
// The second list can be a function which will be passed each item
// from the first list and should return an array to combine against for that
// item. If either argument is not a list, it will be treated as a list.
//
// Ex.,   pair([a,b], [c,d]) => [[a,c],[a,d],[b,c],[b,d]]
function pair(list, listFn) {
  isArray(list) || (list = [list]);
  (isFunction(listFn) || isArray(listFn)) || (listFn = [listFn]);
  return flatMapWith(function(itemLeft){
    return mapWith(function(itemRight) {
      return [itemLeft, itemRight];
    })(isFunction(listFn) ? listFn.call(this, itemLeft) : listFn);
  })(list);
}

// Sort a list using comparator function `fn`,
// returns new array (shallow copy) in sorted order.
function sort(list, fn) {
  return [].concat(list).sort(fn);
}

// Return a copy of the array 'list' flattened by one level, ie [[1,2],[3,4]] = [1,2,3,4]
function flatten(list) {
    return list.reduce(function(items, item) {
        return isArray(item) ? items.concat(item) : item;
    }, []);
}

// Return a flattened list which is the result of passing each
// item in `list` thorugh the function `fn`
function flatMap(list, fn) {
  return flatten(map(list, fn));
}

// Takes a binary comparison function
// and returns a version that adhere's to the Array#sort
// API of return -1, 0 or 1 for sorting.
function comparator(fn) {
    return function(a,b) {
        return fn(a,b) ? -1
            : fn(b,a) ? 1
            : 0;
    };
}

// Right curried versions of the above functions, which
// allow us to create partially applied versions of each
// and use within a `compose()` or `sequence()` call
var getWith = rightCurry(get),
    filterWith = rightCurry(filter),
    mapWith = rightCurry(map),
    groupBy = rightCurry(group),
    mapObjectWith = rightCurry(mapObject),
    flatMapWith = rightCurry(flatMap),
    pluckWith = rightCurry(pluck),
    pairWith = rightCurry(pair),
    sortBy = rightCurry(sort);

    
// Similar to Ramda's useWith(fn,...) which allows you to supply
// a function `fn`, along with one or more transform functions. When
// the returned function is called, it will each argument passed to `fn`
// using the correlating transform function - if there are more arguments
// than transform functions, those arguments will be passed as is.
function useWith(fn /* txnform functions */) {
  var transforms = slice.call(arguments, 1),
      _transform = function(args) {
        return args.map(function(arg, i) {
          return transforms[i](arg);
        });
      };
  return function() {
    var args = slice.call(arguments),
        targs = args.slice(0,transforms.length),
        remaining = args.slice(transforms.length);

    return fn.apply(this, _transform(targs).concat(remaining));
  }
}

// Compose: f(g(x)) for variable number of arguments (recursive)
// Takes two or more functions as arguments and returns a function
// that will compose those functions passing its input to the
// right-most, inner function.
// ie., compose(f,g,h) == f(g(h()))
function compose() {
    var args = [].slice.call(arguments),
        fn = args.shift(),
        gn = args.shift(),
        fog = gn ? function() { return fn(gn.apply(this, arguments)); } : fn;

    return args.length ? compose.apply(this, [fog].concat(args)) : fog;
}

// Reverse of compose, taking it's arguments and chaining
// them from left -> right
// ie., pipeline(f,g,h) = h(g(f()))
var pipeline = flip(compose);

/**
 * Primary application logic for our Functional Programming blog example
 * See related blog series at: http://www.datchley.name/tag/functional-programming/
 * Version: 2.0
 */
 
// A simple, resuable comparison for '>='
function greaterThanOrEqual(a, b) {
  return a >= b
}

// Right curried so we can create useful unary predicates
var greaterThanOrEqualTo = rightCurry(greaterThanOrEqual);

// Create a unary predicate to use with filter that lets us filter
// for values >= 30 days ago
var thirtyDays = (new Date('2015-07-29')).getTime() - (86400000 * 30),
    within30Days = useWith(greaterThanOrEqualTo(thirtyDays), getWith('published'));

//
// [ BLOG POST PART 1 ]
// REQUIREMENT #1: Filter records by publish date
//

// Use our newerThan30Days predicate, modified using withProp
// to allow it to access object's `.date` property
var filtered = filterWith(within30Days)(records);

//
// [ BLOG POST PART 2 ]
// REQUIREMENT #2: Group filtered records by tag
//

// Step 1: explode the data structure (our filtered records) so that we have one record for each tag-post combination. 
var bytags = pairWith(getWith('tags'))(filtered);

// Step 2: group by the tags (pair[1]):
var groupedtags = groupBy(getWith(1), bytags);

// Step 3: reduce each tag-post pair down to just the post (removes the tag)
// function getPostRecords(prop, value) {
//   return pluckWith(0)(value); 
// }

// var finalgroups = mapObjectWith(getPostRecords)(groupedtags);
