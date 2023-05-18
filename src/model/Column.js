export default class Column {
  key;
  type;
  value;
  
  constructor(key, type, value) {
    this.key = key;
    this.type = type;
    this.value = value;
  }

  updateKey(key) {
    this.key = key;
  }

  updateValue(value) {
    this.value = value;
  }

  updateType(type) {
    this.type = type;
  }
}
