import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\RetreatTariffStatusController::__invoke
* @see app/Http/Controllers/RetreatTariffStatusController.php:13
* @route '/retreats/tariffs/{tariff}/status'
*/
export const status = (args: { tariff: string | number } | [tariff: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: status.url(args, options),
    method: 'patch',
})

status.definition = {
    methods: ["patch"],
    url: '/retreats/tariffs/{tariff}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\RetreatTariffStatusController::__invoke
* @see app/Http/Controllers/RetreatTariffStatusController.php:13
* @route '/retreats/tariffs/{tariff}/status'
*/
status.url = (args: { tariff: string | number } | [tariff: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tariff: args }
    }

    if (Array.isArray(args)) {
        args = {
            tariff: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        tariff: args.tariff,
    }

    return status.definition.url
            .replace('{tariff}', parsedArgs.tariff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RetreatTariffStatusController::__invoke
* @see app/Http/Controllers/RetreatTariffStatusController.php:13
* @route '/retreats/tariffs/{tariff}/status'
*/
status.patch = (args: { tariff: string | number } | [tariff: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: status.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\RetreatTariffStatusController::__invoke
* @see app/Http/Controllers/RetreatTariffStatusController.php:13
* @route '/retreats/tariffs/{tariff}/status'
*/
const statusForm = (args: { tariff: string | number } | [tariff: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: status.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RetreatTariffStatusController::__invoke
* @see app/Http/Controllers/RetreatTariffStatusController.php:13
* @route '/retreats/tariffs/{tariff}/status'
*/
statusForm.patch = (args: { tariff: string | number } | [tariff: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: status.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

status.form = statusForm

const tariffs = {
    status: Object.assign(status, status),
}

export default tariffs