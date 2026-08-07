import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DialogiMessageDeleteController::__invoke
* @see app/Http/Controllers/DialogiMessageDeleteController.php:24
* @route '/dialogi/message'
*/
export const deleteMethod = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/dialogi/message',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DialogiMessageDeleteController::__invoke
* @see app/Http/Controllers/DialogiMessageDeleteController.php:24
* @route '/dialogi/message'
*/
deleteMethod.url = (options?: RouteQueryOptions) => {
    return deleteMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DialogiMessageDeleteController::__invoke
* @see app/Http/Controllers/DialogiMessageDeleteController.php:24
* @route '/dialogi/message'
*/
deleteMethod.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DialogiMessageDeleteController::__invoke
* @see app/Http/Controllers/DialogiMessageDeleteController.php:24
* @route '/dialogi/message'
*/
const deleteMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteMethod.url({
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
deleteMethodForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteMethod.form = deleteMethodForm

const message = {
    delete: Object.assign(deleteMethod, deleteMethod),
}

export default message