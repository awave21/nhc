import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AppealsController::__invoke
* @see app/Http/Controllers/AppealsController.php:15
* @route '/appeals'
*/
const AppealsController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: AppealsController.url(options),
    method: 'get',
})

AppealsController.definition = {
    methods: ["get","head"],
    url: '/appeals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AppealsController::__invoke
* @see app/Http/Controllers/AppealsController.php:15
* @route '/appeals'
*/
AppealsController.url = (options?: RouteQueryOptions) => {
    return AppealsController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppealsController::__invoke
* @see app/Http/Controllers/AppealsController.php:15
* @route '/appeals'
*/
AppealsController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: AppealsController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppealsController::__invoke
* @see app/Http/Controllers/AppealsController.php:15
* @route '/appeals'
*/
AppealsController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: AppealsController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AppealsController::__invoke
* @see app/Http/Controllers/AppealsController.php:15
* @route '/appeals'
*/
const AppealsControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: AppealsController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppealsController::__invoke
* @see app/Http/Controllers/AppealsController.php:15
* @route '/appeals'
*/
AppealsControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: AppealsController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppealsController::__invoke
* @see app/Http/Controllers/AppealsController.php:15
* @route '/appeals'
*/
AppealsControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: AppealsController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

AppealsController.form = AppealsControllerForm

export default AppealsController