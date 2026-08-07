import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DialogiClearController::__invoke
* @see app/Http/Controllers/DialogiClearController.php:16
* @route '/dialogi/clear'
*/
const DialogiClearController = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DialogiClearController.url(options),
    method: 'delete',
})

DialogiClearController.definition = {
    methods: ["delete"],
    url: '/dialogi/clear',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DialogiClearController::__invoke
* @see app/Http/Controllers/DialogiClearController.php:16
* @route '/dialogi/clear'
*/
DialogiClearController.url = (options?: RouteQueryOptions) => {
    return DialogiClearController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DialogiClearController::__invoke
* @see app/Http/Controllers/DialogiClearController.php:16
* @route '/dialogi/clear'
*/
DialogiClearController.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DialogiClearController.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DialogiClearController::__invoke
* @see app/Http/Controllers/DialogiClearController.php:16
* @route '/dialogi/clear'
*/
const DialogiClearControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DialogiClearController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DialogiClearController::__invoke
* @see app/Http/Controllers/DialogiClearController.php:16
* @route '/dialogi/clear'
*/
DialogiClearControllerForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DialogiClearController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

DialogiClearController.form = DialogiClearControllerForm

export default DialogiClearController