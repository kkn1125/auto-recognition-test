import Column from "./Column.js";

export default class Table {
  name;
  heads = [["pk", "any"]];
  rows = [];
  isAuto = false;

  constructor(name, isAuto = false) {
    this.name = name;
    isAuto && (this.isAuto = isAuto);
  }

  setHead(heads) {
    this.heads.push(...heads);
  }

  findRowByPk(pk) {
    return this.getObject(this.rows.filter((row) => row[0] === pk))[0];
  }

  findRowByColumn(column, value) {
    const index = this.heads.findIndex((head) => head[0] === column);
    return this.getObject(this.rows.filter((row) => row[index] === value));
  }

  addRow(values) {
    if (this.isAuto) {
      this.heads[0][1] = "number";
    }
    for (let value of values) {
      this.rows.push([this.rows.length, ...value]);
    }
  }

  deleteRow(row) {
    const index = this.rows.findIndex((r) => r.pk === row.pk);
    if (index > -1) {
      this.rows.splice(index, 1);
    }
  }

  getObject(target) {
    return (target || this.rows).map((row, i) => {
      return Object.fromEntries(
        row.map((column, q) => [this.heads[q][0], column])
      );
    });
  }

  toJSON() {
    return {
      name: this.name,
      heads: this.heads,
      rows: this.rows,
      objects: this.getObject(),
    };
  }
}
