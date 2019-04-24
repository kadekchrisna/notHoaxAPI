'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImagesSchema extends Schema {
  up () {
    this.create('images', (table) => {
      table.increments()
      table.timestamps()
      table.string('name', 190).notNullable()
      table.string('image', 190).notNullable()
      table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE')   

    })
  }

  down () {
    this.drop('images')
  }
}

module.exports = ImagesSchema
