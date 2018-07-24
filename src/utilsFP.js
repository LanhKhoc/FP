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
const filterWith = curry(filter);
const mapWith = curry(map);
const flattenMapWith = curry((fn, list) => flatten(mapWith(fn)(list)));
const groupBy = curry(group);
const useWith = (fn, ...fns) => {
  return (...args) => {
    const fargs = args.slice(0, fns.length).map((arg, i) => fns[i](arg));
    return fn(...fargs, ...args.slice(fns.length));
  }
}
const pair = (list, listFn) => {
  Array.isArray(list) || (list = [list]);
  isFunction(listFn) || Array.isArray(listFn) || (listFn = [listFn]);

  return flattenMapWith((itemLeft) => {
    return mapWith((itemRight) => {
      return [itemLeft, itemRight];
    }) (isFunction(listFn) ? listFn.call(this, itemLeft) : listFn);
  })(list);
}