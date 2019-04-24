'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostsSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.increments()
      table.timestamps()
      table.string('title', 190).notNullable()
      table.text('description').notNullable()
      table.string('image', 190).notNullable()
      table.integer("category_id").unsigned().references('id').inTable('categories').onDelete('CASCADE')      
      table.integer("user_id").unsigned().references('id').inTable('users').onDelete('CASCADE')      


    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostsSchema
