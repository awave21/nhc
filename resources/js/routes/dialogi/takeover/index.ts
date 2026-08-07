import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\DialogiTakeoverController::store
* @see app/Http/Controllers/DialogiTakeoverController.php:16
* @route '/dialogi/takeover'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/dialogi/takeover',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DialogiTakeoverController::store
* @see app/Http/Controllers/DialogiTakeoverController.php:16
* @route '/dialogi/takeover'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DialogiTakeoverController::store
* @see app/Http/Controllers/DialogiTakeoverController.php:16
* @route '/dialogi/takeover'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DialogiTakeoverController::store
* @see app/Http/Controllers/DialogiTakeoverController.php:16
* @route '/dialogi/takeover'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DialogiTakeoverController::store
* @see app/Http/Controllers/DialogiTakeoverController.php:16
* @route '/dialogi/takeover'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\DialogiTakeoverController::destroy
* @see app/Http/Controllers/DialogiTakeoverController.php:42
* @route '/dialogi/takeover'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/dialogi/takeover',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DialogiTakeoverController::destroy
* @see app/Http/Controllers/DialogiTakeoverController.php:42
* @route '/dialogi/takeover'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DialogiTakeoverController::destroy
* @see app/Http/Controllers/DialogiTakeoverController.php:42
* @route '/dialogi/takeover'
*/
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DialogiTakeoverController::destroy
* @see app/Http/Controllers/DialogiTakeoverController.php:42
* @route '/dialogi/takeover'
*/
const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DialogiTakeoverController::destroy
* @see app/Http/Controllers/DialogiTakeoverController.php:42
* @route '/dialogi/takeover'
*/
destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const takeover = {
    store: Object.assign(store, store),
    destroy: Object.assign(destroy, destroy),
}

export default takeover