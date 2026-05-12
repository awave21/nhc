import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrderController::__invoke
* @see app/Http/Controllers/OrderController.php:15
* @route '/order'
*/
const OrderController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: OrderController.url(options),
    method: 'get',
})

OrderController.definition = {
    methods: ["get","head"],
    url: '/order',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::__invoke
* @see app/Http/Controllers/OrderController.php:15
* @route '/order'
*/
OrderController.url = (options?: RouteQueryOptions) => {
    return OrderController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::__invoke
* @see app/Http/Controllers/OrderController.php:15
* @route '/order'
*/
OrderController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: OrderController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::__invoke
* @see app/Http/Controllers/OrderController.php:15
* @route '/order'
*/
OrderController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: OrderController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderController::__invoke
* @see app/Http/Controllers/OrderController.php:15
* @route '/order'
*/
const OrderControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: OrderController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::__invoke
* @see app/Http/Controllers/OrderController.php:15
* @route '/order'
*/
OrderControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: OrderController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::__invoke
* @see app/Http/Controllers/OrderController.php:15
* @route '/order'
*/
OrderControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: OrderController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

OrderController.form = OrderControllerForm

export default OrderController