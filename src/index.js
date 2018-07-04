const records = [
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

// NOTE: Utils
const toString = Object.prototype.toString;
const isFunction = o => toString.call(o) == '[object Function]';

const getWith = p => x => x[p];
const reverseArgs = fn => (...args) => fn(...args.reverse());
const curry = (fn, N = fn.length) => {
	return (function nextCurried(prevArgs) {
		return (...nextArgs) => {
			let args = [...prevArgs, ...nextArgs];
			if (args.length >= N) { return fn(...args.slice(0, N)); }
			return nextCurried(args);
		}
	}([]))
}
const curryRight = (fn, N = fn.length) => curry(reverseArgs(fn), N);
const filter = (fn, list) => list.filter(fn);
const map = (fn, list) => list.map(fn);
const flatten = list => list.reduce((items, item) => {
  return Array.isArray(item) ? [...items, ...item] : item;
}, []);
const useWith = (fn, ...fns) => {
  return (...args) => {
    const fargs = args.slice(0, fns.length).map((arg, i) => fns[i](arg));
    return fn(...fargs, ...args.slice(fns.length));
  }
}
const group = (prop, list) => {
  return list.reduce((grouped, item) => {
    const key = isFunction(prop) ? prop.apply(this, [item]) : prop;
    grouped[key] = grouped[key] || [];
    grouped[key].push(item);
    return grouped;
  }, {});
}


const filterWith = curry(filter);
const mapWith = curry(map);
const flattenMapWith = curry((fn, list) => flatten(mapWith(fn)(list)));
const groupBy = curry(group);
const pair = (list, listFn) => {
  Array.isArray(list) || (list = [list]);
  isFunction(listFn) || Array.isArray(listFn) || (listFn = [listFn]);

  return flattenMapWith((itemLeft) => {
    return mapWith((itemRight) => {
      return [itemLeft, itemRight];
    }) (isFunction(listFn) ? listFn.call(this, itemLeft) : listFn);
  })(list);
}
const GTE = (a, b) => a >= b;

const thirtyDaysAgo = (new Date('2015-07-29')).getTime() - (86400000 * 30);
const within30Days = curryRight(GTE)(thirtyDaysAgo);
const filtered = filterWith(useWith(within30Days, getWith('published')))(records);






