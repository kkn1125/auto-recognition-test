import Database from "./Database.js";

export default class DBManager {
  /** @type {Database[]} */
  dbs = [];

  findAll() {
    return this.dbs.map((db) => db.toJSON());
  }

  findOneByName(name) {
    return this.dbs.find((db) => db.name === name);
  }

  createDB(name) {
    const db = new Database(name);
    this.dbs.push(db);
    return db;
  }

  updateDB(name, key, value) {
    const hasDB = this.dbs.find((d) => d.name === name);

    if (hasDB) {
      hasDB.update(key, value);
    }
  }

  deleteDB(name) {
    const index = this.dbs.findIndex((db) => db.name === name);
    if (index > -1) {
      this.dbs.splice(index, 1);
    }
  }
}
