import Table from "./Table.js";

export default class Database {
  name;
  /** @type {Table[]} */
  tables = [];
  createdAt;
  updatedAt;

  constructor(name) {
    this.name = name;
    this.createdAt = +new Date();
    this.updatedAt = +new Date();
  }

  findOneByName(name) {
    return this.tables.find((table) => table.name === name);
  }

  createTable(name, isAuto) {
    const table = new Table(name, isAuto);
    this.tables.push(table);
    this.updatedAt = +new Date();
    return table;
  }

  deleteTable(table) {
    const index = this.tables.findIndex((tb) => tb.name === table.name);
    if (index > -1) {
      this.tables.splice(index, 1);
    }
  }

  update(key, value) {
    this[key] = value;
    this.updatedAt = +new Date();
  }

  toJSON() {
    return {
      name: this.name,
      tables: this.tables.map((table) => table.toJSON()),
    };
  }
}
