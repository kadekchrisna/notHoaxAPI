'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with opinions
 */

const Opinion = use('App/Models/Opinion')
const { validate } = use("Validator");

class OpinionController {
    /**
     * Show a list of all opinions.
     * GET opinions
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
    }

    /**
     * Render a form to be used for creating a new opinion.
     * GET opinions/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create({ request, response, view }) {
    }

    /**
     * Create/save a new opinion.
     * POST opinions
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {

    }

    /**
     * Display a single opinion.
     * GET opinions/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
    }

    /**
     * Render a form to update an existing opinion.
     * GET opinions/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit({ params, request, response, view }) {
    }

    /**
     * Update opinion details.
     * PUT or PATCH opinions/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response, auth }) {

        const Post = use('App/Models/Post')

        try {
            const rules = {
                opinion_up: 'required|integer',
                opinion_down: 'required|integer',
            }

            const validation = await validate(request.all(), rules);
            if (validation.fails())
                return response.status(400).json({
                    message: validation.messages()
                });
            const post_id = Number(params.id)
            const { opinion_down, opinion_up } = request.post()
            const user_id = auth.current.user.id


            const checkOp = await Opinion.query()
                .where('post_id', post_id)
                .andWhere('user_id', user_id)
                .getCount()

            if (checkOp < 1) {

                // if (opinion_up > 0) {
                //     const post = await Post.find(params.id)
                //     post.up = post.up + 1
                //     await post.save()

                // } else if (opinion_up < 1) {
                //     const post = await Post.find(params.id)
                //     post.up = post.up - 1
                //     await post.save()

                // } else if (opinion_down > 0) {
                //     const post = await Post.find(params.id)
                //     post.down = post.down + 1
                //     await post.save()
                // } else if (opinion_down < 1) {
                //     const post = await Post.find(params.id)
                //     post.down = post.down - 1
                //     await post.save()
                // }


                const opinion = new Opinion()
                opinion.opinion_up = opinion_up
                opinion.opinion_down = opinion_down
                opinion.post_id = post_id
                opinion.user_id = user_id

                await opinion.save()

                const opinionDisplay = await Opinion.query()
                    .where('post_id', post_id)
                    .sum('opinion_up as up')
                    .sum('opinion_down as down')

                return response.status(201).json({
                    message: 'New opinion added.',
                    data: opinionDisplay
                })
            } else {

                const opinion = await Opinion.findBy('post_id', post_id)
                opinion.opinion_up = opinion_up
                opinion.opinion_down = opinion_down
                opinion.user_id = user_id

                await opinion.save()

                const opinionDisplay = await Opinion.query()
                    .where('post_id', post_id)
                    .sum('opinion_up as up')
                    .sum('opinion_down as down')

                return response.status(200).json({
                    message: 'Opinion updated.',
                    opinion: opinionDisplay[0]
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
     * Delete a opinion with id.
     * DELETE opinions/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
    }
}

module.exports = OpinionController
