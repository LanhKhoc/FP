const _Container = {
  create(val) {
    return Object.assign(Object.create(this), { val });
  },
  map(fn) {
    return Container(fn(this.val));
  }
}

const Container = x => _Container.create(x);



const _Maybe = {
  create(val) {
      return Object.assign(Object.create(this), { val });
  },
  map(fn) {
    return this.val ? Maybe(fn(this.val)) : Maybe(null);
  }
}

const Maybe = x => _Maybe.create(x);
