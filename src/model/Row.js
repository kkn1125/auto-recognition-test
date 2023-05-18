import { v4 } from "uuid";
import Column from "./Column.js";

export default class Row {
  pk;
  /** @type {Map<string, Column>} data type */
  columns = new Map();

  constructor(/** @type {Column[]} */ columns) {
    this.pk = v4();
    columns &&
      columns.forEach((column) => {
        this.columns.set(column.key, column);
      });
  }

  addColumn(column) {
    this.columns.set(column.key, column);
  }

  deleteColumn(key) {
    this.columns.has(key) && this.columns.delete(key);
  }

  updateColumn(column) {
    const hasColumn = this.columns.get(column.key);
    if (hasColumn) {
      hasColumn.key && hasColumn.updateKey(column.key);
      hasColumn.type && hasColumn.updateType(column.type);
      hasColumn.value && hasColumn.updateValue(column.value);
    }
  }

  toJSON() {
    return Object.fromEntries(Array.from(this.columns));
  }
}
