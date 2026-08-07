import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
const DialogiMoreController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: DialogiMoreController.url(options),
    method: 'get',
})

DialogiMoreController.definition = {
    methods: ["get","head"],
    url: '/dialogi/more',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
DialogiMoreController.url = (options?: RouteQueryOptions) => {
    return DialogiMoreController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
DialogiMoreController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: DialogiMoreController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
DialogiMoreController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: DialogiMoreController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
const DialogiMoreControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: DialogiMoreController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
DialogiMoreControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: DialogiMoreController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
DialogiMoreControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: DialogiMoreController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

DialogiMoreController.form = DialogiMoreControllerForm

export default DialogiMoreController