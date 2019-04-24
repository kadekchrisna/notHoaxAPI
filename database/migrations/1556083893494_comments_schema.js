'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CommentsSchema extends Schema {
  up () {
    this.create('comments', (table) => {
      table.increments()
      table.timestamps()
      table.string('comment', 190).notNullable()
      table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE')         
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE') 
    })
  }

  down () {
    this.drop('comments')
  }
}

module.exports = CommentsSchema
