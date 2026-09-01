import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\RetreatProjectStatusController::__invoke
* @see app/Http/Controllers/RetreatProjectStatusController.php:13
* @route '/retreats/projects/{project}/status'
*/
export const status = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: status.url(args, options),
    method: 'patch',
})

status.definition = {
    methods: ["patch"],
    url: '/retreats/projects/{project}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\RetreatProjectStatusController::__invoke
* @see app/Http/Controllers/RetreatProjectStatusController.php:13
* @route '/retreats/projects/{project}/status'
*/
status.url = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { project: args }
    }

    if (Array.isArray(args)) {
        args = {
            project: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        project: args.project,
    }

    return status.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RetreatProjectStatusController::__invoke
* @see app/Http/Controllers/RetreatProjectStatusController.php:13
* @route '/retreats/projects/{project}/status'
*/
status.patch = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: status.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\RetreatProjectStatusController::__invoke
* @see app/Http/Controllers/RetreatProjectStatusController.php:13
* @route '/retreats/projects/{project}/status'
*/
const statusForm = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: status.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RetreatProjectStatusController::__invoke
* @see app/Http/Controllers/RetreatProjectStatusController.php:13
* @route '/retreats/projects/{project}/status'
*/
statusForm.patch = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: status.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

status.form = statusForm

const projects = {
    status: Object.assign(status, status),
}

export default projects