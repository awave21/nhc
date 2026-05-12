import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
export const more = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: more.url(options),
    method: 'get',
})

more.definition = {
    methods: ["get","head"],
    url: '/dialogi/more',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
more.url = (options?: RouteQueryOptions) => {
    return more.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
more.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: more.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
more.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: more.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
const moreForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: more.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
moreForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: more.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
moreForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: more.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

more.form = moreForm

const dialogi = {
    more: Object.assign(more, more),
}

export default dialogi