const toString = Object.prototype.toString;
const isFunction = o => toString.call(o) == '[object Function]';
const get = (prop, item) => item[prop];
const filter = (fn, list) => list.filter(fn);
const map = (fn, list) => list.map(fn);
const flatten = list => list.reduce((items, item) => {
  return Array.isArray(item) ? [...items, ...item] : [...items, item];
}, []);
const group = (prop, list) => {
  return list.reduce((grouped, item) => {
    const key = isFunction(prop) ? prop.apply(this, [item]) : prop;
    grouped[key] = grouped[key] || [];
    grouped[key].push(item);
    return grouped;
  }, {});
}