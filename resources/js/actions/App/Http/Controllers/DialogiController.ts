import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DialogiController::__invoke
* @see app/Http/Controllers/DialogiController.php:19
* @route '/dialogi'
*/
const DialogiController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: DialogiController.url(options),
    method: 'get',
})

DialogiController.definition = {
    methods: ["get","head"],
    url: '/dialogi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DialogiController::__invoke
* @see app/Http/Controllers/DialogiController.php:19
* @route '/dialogi'
*/
DialogiController.url = (options?: RouteQueryOptions) => {
    return DialogiController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DialogiController::__invoke
* @see app/Http/Controllers/DialogiController.php:19
* @route '/dialogi'
*/
DialogiController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: DialogiController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DialogiController::__invoke
* @see app/Http/Controllers/DialogiController.php:19
* @route '/dialogi'
*/
DialogiController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: DialogiController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DialogiController::__invoke
* @see app/Http/Controllers/DialogiController.php:19
* @route '/dialogi'
*/
const DialogiControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: DialogiController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DialogiController::__invoke
* @see app/Http/Controllers/DialogiController.php:19
* @route '/dialogi'
*/
DialogiControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: DialogiController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DialogiController::__invoke
* @see app/Http/Controllers/DialogiController.php:19
* @route '/dialogi'
*/
DialogiControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: DialogiController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

DialogiController.form = DialogiControllerForm

export default DialogiController