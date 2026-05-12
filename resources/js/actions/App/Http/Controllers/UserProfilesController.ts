import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UserProfilesController::__invoke
* @see app/Http/Controllers/UserProfilesController.php:16
* @route '/user-profiles'
*/
const UserProfilesController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: UserProfilesController.url(options),
    method: 'get',
})

UserProfilesController.definition = {
    methods: ["get","head"],
    url: '/user-profiles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserProfilesController::__invoke
* @see app/Http/Controllers/UserProfilesController.php:16
* @route '/user-profiles'
*/
UserProfilesController.url = (options?: RouteQueryOptions) => {
    return UserProfilesController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserProfilesController::__invoke
* @see app/Http/Controllers/UserProfilesController.php:16
* @route '/user-profiles'
*/
UserProfilesController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: UserProfilesController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserProfilesController::__invoke
* @see app/Http/Controllers/UserProfilesController.php:16
* @route '/user-profiles'
*/
UserProfilesController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: UserProfilesController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserProfilesController::__invoke
* @see app/Http/Controllers/UserProfilesController.php:16
* @route '/user-profiles'
*/
const UserProfilesControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: UserProfilesController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserProfilesController::__invoke
* @see app/Http/Controllers/UserProfilesController.php:16
* @route '/user-profiles'
*/
UserProfilesControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: UserProfilesController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserProfilesController::__invoke
* @see app/Http/Controllers/UserProfilesController.php:16
* @route '/user-profiles'
*/
UserProfilesControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: UserProfilesController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

UserProfilesController.form = UserProfilesControllerForm

export default UserProfilesController