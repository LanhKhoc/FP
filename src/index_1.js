const map = fn => arr => arr.map(fn);
const curry = (fn, N = fn.length) => {
  return (function nextCurried(prevArgs) {
    return (...nextArgs) => {
      const args = [...prevArgs, ...nextArgs];
      if (args.length >= N) { return fn(...args.slice(0, N)); }
      return nextCurried(args);
    }
  })([]);
}

const getElements = (selector) => {
  return Array.from(document.querySelectorAll(selector));
};
const remove = className => el => el.classList.remove(className);
const removeClassHide = remove('hide');
const getListBoxElement = getElements('.box');

setTimeout(() => map(removeClassHide)(getListBoxElement), 3000);