import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RetreatsController::__invoke
* @see app/Http/Controllers/RetreatsController.php:25
* @route '/retreats'
*/
const RetreatsController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RetreatsController.url(options),
    method: 'get',
})

RetreatsController.definition = {
    methods: ["get","head"],
    url: '/retreats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RetreatsController::__invoke
* @see app/Http/Controllers/RetreatsController.php:25
* @route '/retreats'
*/
RetreatsController.url = (options?: RouteQueryOptions) => {
    return RetreatsController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RetreatsController::__invoke
* @see app/Http/Controllers/RetreatsController.php:25
* @route '/retreats'
*/
RetreatsController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RetreatsController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RetreatsController::__invoke
* @see app/Http/Controllers/RetreatsController.php:25
* @route '/retreats'
*/
RetreatsController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: RetreatsController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RetreatsController::__invoke
* @see app/Http/Controllers/RetreatsController.php:25
* @route '/retreats'
*/
const RetreatsControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: RetreatsController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RetreatsController::__invoke
* @see app/Http/Controllers/RetreatsController.php:25
* @route '/retreats'
*/
RetreatsControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: RetreatsController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RetreatsController::__invoke
* @see app/Http/Controllers/RetreatsController.php:25
* @route '/retreats'
*/
RetreatsControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: RetreatsController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

RetreatsController.form = RetreatsControllerForm

export default RetreatsController