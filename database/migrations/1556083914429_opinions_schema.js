'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OpinionsSchema extends Schema {
  up () {
    this.create('opinions', (table) => {
      table.increments()
      table.timestamps()
      table.boolean('opinion_up').nullable()
      table.boolean('opinion_down').nullable()
      table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE')         
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE') 
    })
  }

  down () {
    this.drop('opinions')
  }
}

module.exports = OpinionsSchema
