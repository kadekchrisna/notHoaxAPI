'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


const Category = use('App/Models/Category')
const { validate } = use("Validator");


/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
    /**
     * Show a list of all categories.
     * GET categories
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {

        try {
            const categories = await Category.query()
                .orderBy('name', 'asc')
                .fetch()

            return response.status(200).json({
                message: 'Get all categories',
                data: categories
            })

        } catch (error) {
            console.log(error);
            return response.status(400).json({
                message: 'Something went wrong!'
            })


        }
    }

    /**
     * Render a form to be used for creating a new category.
     * GET categories/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {
    }

    /**
     * Create/save a new category.
     * POST categories
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        const Helpers = use('Helpers')
        try {
            const rules = {
                name: 'required|string',
            }
            const imageRules = {
                types: ['image'],
                size: '2mb',
                extnames: ['png', 'jpg']
            }
            const validation = await validate(request.all(), rules);
            if (validation.fails())
                return response.status(400).json({
                    message: validation.messages()
                });

            const image = request.file('image', imageRules)
            console.log(image);

            const name = image.clientName;
            const ext = name.split(".")[1];
            const ts = new Date().valueOf();
            const fileName = ts + "." + ext;

            await image.move(Helpers.publicPath("uploads/categories"), {
                name: fileName
            });

            if (!image.moved()) {
                return response.status(400).json({
                    message: image.errors()
                })

            } else {

                const category = new Category();
                category.name = request.input("name");
                category.cover = fileName;
                await category.save();

                return response.status(201).json({
                    message: 'New category added.',
                    data: category
                })

            }

        } catch (error) {
            console.log(error);
            return response.status(400).json({
                message: 'Something went wrong!'

            })

        }
    }

    /**
     * Display a single category.
     * GET categories/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {

        const Comment = use('App/Models/Comment')
        const Opinion = use('App/Models/Opinion')

        const Post = use('App/Models/Post')

        try {
            const category = await Category.find(params.id)
            if (category == null) {
                return response.status(404).json({
                    message: 'Category not found.'
                })
            }

            const post = await Post.query()
                .where('category_id', params.id)
                .fetch()

            return response.status(200).json({
                message: 'Get category success.',
                data: post
            })
        } catch (error) {

        }
    }

    /**
     * Render a form to update an existing category.
     * GET categories/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {
    }

    /**
     * Update category details.
     * PUT or PATCH categories/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
    }

    /**
     * Delete a category with id.
     * DELETE categories/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
    }
}

module.exports = CategoryController
