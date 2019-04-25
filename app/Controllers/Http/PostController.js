'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with posts
 */

const Post = use('App/Models/Post')
const User = use('App/Models/User')
const Category = use('App/Models/Category')

const { validate } = use("Validator");

class PostController {
    /**
     * Show a list of all posts.
     * GET posts
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {

        try {

            const posts = await Post.query()
                .select('posts.id as id', 'posts.title', 'posts.image', 'posts.up', 'posts.down', 'posts.comments', 'posts.created_at', 'categories.name', 'categories.cover', 'users.username', 'users.pp')
                .leftJoin('users', 'posts.user_id', 'users.id')
                .leftJoin('categories', 'categories.id', 'posts.category_id')
                .fetch()

            return response.status(200).json({
                message: 'Get Posts all',
                data: posts
            })

        } catch (error) {
            console.log(error);
            return response.status(400).json({
                message: 'Something went wrong!'
            })

        }
    }

    /**
     * Render a form to be used for creating a new post.
     * GET posts/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {
    }

    /**
     * Create/save a new post.
     * POST posts
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response, auth }) {
        const Helpers = use('Helpers')
        try {
            const rules = {
                title: 'required|string',
                description: 'string',
                category_id: 'required|integer',
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

            const name = image.clientName;
            const ext = name.split(".")[1];
            const ts = new Date().valueOf();
            const fileName = ts + "." + ext;

            await image.move(Helpers.publicPath("uploads/posts"), {
                name: fileName
            });

            if (!image.moved()) {
                return response.status(400).json({
                    message: image.errors()
                })

            } else {

                const post = new Post();
                post.title = request.input("title");
                post.description = request.input("description");
                post.category_id = request.input("category_id");
                post.user_id = auth.current.user.id
                post.image = fileName;
                await post.save();

                return response.status(201).json({
                    message: 'New post added.',
                    data: post
                })

            }

        } catch (error) {
            return response.status(400).json({
                message: 'Something went wrong!'
            })

        }

    }

    /**
     * Display a single post.
     * GET posts/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */

    async show({ params, request, response, view }) {
        const Comment = use('App/Models/Comment')
        const Opinion = use('App/Models/Opinion')
        try {
            const post_id = Number(params.id)

            const checkP = await Post.find(post_id)

            if (checkP == null) {
                return response.status(404).json({
                    message: 'Post not found!'
                })
            }

            const post = await Post.query()
                .select('posts.id as id', 'posts.title', 'posts.description', 'posts.image', 'posts.up', 'posts.down', 'posts.comments', 'posts.created_at', 'categories.name', 'categories.cover', 'users.username', 'users.pp')
                .leftJoin('users', 'posts.user_id', 'users.id')
                .leftJoin('categories', 'categories.id', 'posts.category_id')
                .where('posts.id', post_id)
                .fetch()

            const comment = await Comment.query()
                .select('comments.id as id', 'comments.created_at', 'comments.comment', 'users.username', 'users.pp')
                .leftJoin('users', 'comments.user_id', 'users.id')
                .where('post_id', post_id)
                .fetch()

            const opinion = await Opinion.query()
                .where('post_id', post_id)
                .sum('opinion_up as up')
                .sum('opinion_down as down')


            return response.status(200).json({
                message: 'Post found!',
                post: post.rows[0],
                comment: comment,
                opinion: opinion[0]

            })

        } catch (error) {
            console.log(error);
            return response.status(400).json({
                message: 'Something went wrong!'
            })

        }
    }

    /**
     * Render a form to update an existing post.
     * GET posts/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {
    }

    /**
     * Update post details.
     * PUT or PATCH posts/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
    }

    /**
     * Delete a post with id.
     * DELETE posts/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
    }
}

module.exports = PostController
