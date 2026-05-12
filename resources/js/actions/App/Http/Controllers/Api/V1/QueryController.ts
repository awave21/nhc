import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\QueryController::__invoke
* @see app/Http/Controllers/Api/V1/QueryController.php:15
* @route '/api/v1/query'
*/
const QueryController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: QueryController.url(options),
    method: 'post',
})

QueryController.definition = {
    methods: ["post"],
    url: '/api/v1/query',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\QueryController::__invoke
* @see app/Http/Controllers/Api/V1/QueryController.php:15
* @route '/api/v1/query'
*/
QueryController.url = (options?: RouteQueryOptions) => {
    return QueryController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\QueryController::__invoke
* @see app/Http/Controllers/Api/V1/QueryController.php:15
* @route '/api/v1/query'
*/
QueryController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: QueryController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\QueryController::__invoke
* @see app/Http/Controllers/Api/V1/QueryController.php:15
* @route '/api/v1/query'
*/
const QueryControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: QueryController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\QueryController::__invoke
* @see app/Http/Controllers/Api/V1/QueryController.php:15
* @route '/api/v1/query'
*/
QueryControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: QueryController.url(options),
    method: 'post',
})

QueryController.form = QueryControllerForm

export default QueryController