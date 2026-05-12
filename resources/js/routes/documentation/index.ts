import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DocumentationUnlockController::unlock
* @see app/Http/Controllers/DocumentationUnlockController.php:10
* @route '/documentation/unlock'
*/
export const unlock = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unlock.url(options),
    method: 'post',
})

unlock.definition = {
    methods: ["post"],
    url: '/documentation/unlock',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentationUnlockController::unlock
* @see app/Http/Controllers/DocumentationUnlockController.php:10
* @route '/documentation/unlock'
*/
unlock.url = (options?: RouteQueryOptions) => {
    return unlock.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentationUnlockController::unlock
* @see app/Http/Controllers/DocumentationUnlockController.php:10
* @route '/documentation/unlock'
*/
unlock.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unlock.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentationUnlockController::unlock
* @see app/Http/Controllers/DocumentationUnlockController.php:10
* @route '/documentation/unlock'
*/
const unlockForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unlock.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentationUnlockController::unlock
* @see app/Http/Controllers/DocumentationUnlockController.php:10
* @route '/documentation/unlock'
*/
unlockForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unlock.url(options),
    method: 'post',
})

unlock.form = unlockForm

/**
* @see \App\Http\Controllers\DocumentationUnlockController::lock
* @see app/Http/Controllers/DocumentationUnlockController.php:29
* @route '/documentation/lock'
*/
export const lock = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lock.url(options),
    method: 'post',
})

lock.definition = {
    methods: ["post"],
    url: '/documentation/lock',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentationUnlockController::lock
* @see app/Http/Controllers/DocumentationUnlockController.php:29
* @route '/documentation/lock'
*/
lock.url = (options?: RouteQueryOptions) => {
    return lock.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentationUnlockController::lock
* @see app/Http/Controllers/DocumentationUnlockController.php:29
* @route '/documentation/lock'
*/
lock.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lock.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentationUnlockController::lock
* @see app/Http/Controllers/DocumentationUnlockController.php:29
* @route '/documentation/lock'
*/
const lockForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: lock.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DocumentationUnlockController::lock
* @see app/Http/Controllers/DocumentationUnlockController.php:29
* @route '/documentation/lock'
*/
lockForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: lock.url(options),
    method: 'post',
})

lock.form = lockForm

const documentation = {
    unlock: Object.assign(unlock, unlock),
    lock: Object.assign(lock, lock),
}

export default documentation