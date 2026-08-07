import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RetreatTariffStatusController::__invoke
* @see app/Http/Controllers/RetreatTariffStatusController.php:13
* @route '/retreats/tariffs/{tariff}/status'
*/
const RetreatTariffStatusController = (args: { tariff: string | number } | [tariff: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RetreatTariffStatusController.url(args, options),
    method: 'patch',
})

RetreatTariffStatusController.definition = {
    methods: ["patch"],
    url: '/retreats/tariffs/{tariff}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\RetreatTariffStatusController::__invoke
* @see app/Http/Controllers/RetreatTariffStatusController.php:13
* @route '/retreats/tariffs/{tariff}/status'
*/
RetreatTariffStatusController.url = (args: { tariff: string | number } | [tariff: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return RetreatTariffStatusController.definition.url
            .replace('{tariff}', parsedArgs.tariff.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RetreatTariffStatusController::__invoke
* @see app/Http/Controllers/RetreatTariffStatusController.php:13
* @route '/retreats/tariffs/{tariff}/status'
*/
RetreatTariffStatusController.patch = (args: { tariff: string | number } | [tariff: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RetreatTariffStatusController.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\RetreatTariffStatusController::__invoke
* @see app/Http/Controllers/RetreatTariffStatusController.php:13
* @route '/retreats/tariffs/{tariff}/status'
*/
const RetreatTariffStatusControllerForm = (args: { tariff: string | number } | [tariff: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: RetreatTariffStatusController.url(args, {
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
RetreatTariffStatusControllerForm.patch = (args: { tariff: string | number } | [tariff: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: RetreatTariffStatusController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

RetreatTariffStatusController.form = RetreatTariffStatusControllerForm

export default RetreatTariffStatusController