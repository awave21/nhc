import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Handbooks\HandbooksController::__invoke
* @see app/Http/Controllers/Handbooks/HandbooksController.php:13
* @route '/handbooks'
*/
const HandbooksController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HandbooksController.url(options),
    method: 'get',
})

HandbooksController.definition = {
    methods: ["get","head"],
    url: '/handbooks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbooksController::__invoke
* @see app/Http/Controllers/Handbooks/HandbooksController.php:13
* @route '/handbooks'
*/
HandbooksController.url = (options?: RouteQueryOptions) => {
    return HandbooksController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbooksController::__invoke
* @see app/Http/Controllers/Handbooks/HandbooksController.php:13
* @route '/handbooks'
*/
HandbooksController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HandbooksController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbooksController::__invoke
* @see app/Http/Controllers/Handbooks/HandbooksController.php:13
* @route '/handbooks'
*/
HandbooksController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: HandbooksController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbooksController::__invoke
* @see app/Http/Controllers/Handbooks/HandbooksController.php:13
* @route '/handbooks'
*/
const HandbooksControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HandbooksController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbooksController::__invoke
* @see app/Http/Controllers/Handbooks/HandbooksController.php:13
* @route '/handbooks'
*/
HandbooksControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HandbooksController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbooksController::__invoke
* @see app/Http/Controllers/Handbooks/HandbooksController.php:13
* @route '/handbooks'
*/
HandbooksControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HandbooksController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

HandbooksController.form = HandbooksControllerForm

export default HandbooksController