import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RetreatProjectStatusController::__invoke
* @see app/Http/Controllers/RetreatProjectStatusController.php:13
* @route '/retreats/projects/{project}/status'
*/
const RetreatProjectStatusController = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RetreatProjectStatusController.url(args, options),
    method: 'patch',
})

RetreatProjectStatusController.definition = {
    methods: ["patch"],
    url: '/retreats/projects/{project}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\RetreatProjectStatusController::__invoke
* @see app/Http/Controllers/RetreatProjectStatusController.php:13
* @route '/retreats/projects/{project}/status'
*/
RetreatProjectStatusController.url = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return RetreatProjectStatusController.definition.url
            .replace('{project}', parsedArgs.project.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RetreatProjectStatusController::__invoke
* @see app/Http/Controllers/RetreatProjectStatusController.php:13
* @route '/retreats/projects/{project}/status'
*/
RetreatProjectStatusController.patch = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RetreatProjectStatusController.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\RetreatProjectStatusController::__invoke
* @see app/Http/Controllers/RetreatProjectStatusController.php:13
* @route '/retreats/projects/{project}/status'
*/
const RetreatProjectStatusControllerForm = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: RetreatProjectStatusController.url(args, {
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
RetreatProjectStatusControllerForm.patch = (args: { project: string | number } | [project: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: RetreatProjectStatusController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

RetreatProjectStatusController.form = RetreatProjectStatusControllerForm

export default RetreatProjectStatusController