import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DialogiMessageDeleteController::__invoke
* @see app/Http/Controllers/DialogiMessageDeleteController.php:24
* @route '/dialogi/message'
*/
const DialogiMessageDeleteController = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DialogiMessageDeleteController.url(options),
    method: 'delete',
})

DialogiMessageDeleteController.definition = {
    methods: ["delete"],
    url: '/dialogi/message',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DialogiMessageDeleteController::__invoke
* @see app/Http/Controllers/DialogiMessageDeleteController.php:24
* @route '/dialogi/message'
*/
DialogiMessageDeleteController.url = (options?: RouteQueryOptions) => {
    return DialogiMessageDeleteController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DialogiMessageDeleteController::__invoke
* @see app/Http/Controllers/DialogiMessageDeleteController.php:24
* @route '/dialogi/message'
*/
DialogiMessageDeleteController.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: DialogiMessageDeleteController.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DialogiMessageDeleteController::__invoke
* @see app/Http/Controllers/DialogiMessageDeleteController.php:24
* @route '/dialogi/message'
*/
const DialogiMessageDeleteControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DialogiMessageDeleteController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DialogiMessageDeleteController::__invoke
* @see app/Http/Controllers/DialogiMessageDeleteController.php:24
* @route '/dialogi/message'
*/
DialogiMessageDeleteControllerForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DialogiMessageDeleteController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

DialogiMessageDeleteController.form = DialogiMessageDeleteControllerForm

export default DialogiMessageDeleteController