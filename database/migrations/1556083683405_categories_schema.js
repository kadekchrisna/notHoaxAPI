'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CategoriesSchema extends Schema {
  up () {
    this.create('categories', (table) => {
      table.increments()
      table.timestamps()
      table.string('name', 190).notNullable().unique()
      table.string('image', 190).notNullable()
    })
  }

  down () {
    this.drop('categories')
  }
}

module.exports = CategoriesSchema
