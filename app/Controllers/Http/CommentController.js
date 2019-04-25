'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with comments
 */

const Comment = use('App/Models/Comment')
const { validate } = use("Validator");

class CommentController {
    /**
     * Show a list of all comments.
     * GET comments
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
    }

    /**
     * Render a form to be used for creating a new comment.
     * GET comments/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {
    }

    /**
     * Create/save a new comment.
     * POST comments
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response, auth }) {
        const Post = use('App/Models/Post')
        try {
            const rules = {
                comment: 'required|string',
                post_id: 'required|integer',
            }

            const validation = await validate(request.all(), rules);
            if (validation.fails())
                return response.status(400).json({
                    message: validation.messages()
                });
            const user_id = auth.current.user.id
            const commentData = request.input("comment");
            const postId = request.input("post_id");            

            const comment = new Comment();
            comment.comment = commentData
            comment.post_id = postId
            comment.user_id = user_id
            await comment.save();

            const { post_id } = request.post()
            const post = await Post.find(post_id)
            post.comments = post.comments + 1
            await post.save()

            const commentDisplay = await Comment.query()
            .select('comments.id as id', 'comments.created_at', 'comments.comment', 'users.username', 'users.pp')
            .leftJoin('users', 'comments.user_id', 'users.id')
            .where('user_id', user_id)
            .andWhere('comment', 'like', commentData)
            .andWhere('post_id', postId)
            .fetch()

            return response.status(201).json({
                message: 'New comment added.',
                data: commentDisplay.rows[0]
            })


        } catch (error) {
            console.log(error);
            
            return response.status(400).json({
                message: 'Something went wrong!'
            })

        }
    }

    /**
     * Display a single comment.
     * GET comments/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
    }

    /**
     * Render a form to update an existing comment.
     * GET comments/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {
    }

    /**
     * Update comment details.
     * PUT or PATCH comments/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
    }

    /**
     * Delete a comment with id.
     * DELETE comments/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
    }
}

module.exports = CommentController
