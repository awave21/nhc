import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DocumentationController::__invoke
* @see app/Http/Controllers/DocumentationController.php:14
* @route '/documentation'
*/
const DocumentationController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: DocumentationController.url(options),
    method: 'get',
})

DocumentationController.definition = {
    methods: ["get","head"],
    url: '/documentation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentationController::__invoke
* @see app/Http/Controllers/DocumentationController.php:14
* @route '/documentation'
*/
DocumentationController.url = (options?: RouteQueryOptions) => {
    return DocumentationController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentationController::__invoke
* @see app/Http/Controllers/DocumentationController.php:14
* @route '/documentation'
*/
DocumentationController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: DocumentationController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentationController::__invoke
* @see app/Http/Controllers/DocumentationController.php:14
* @route '/documentation'
*/
DocumentationController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: DocumentationController.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DocumentationController::__invoke
* @see app/Http/Controllers/DocumentationController.php:14
* @route '/documentation'
*/
const DocumentationControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: DocumentationController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentationController::__invoke
* @see app/Http/Controllers/DocumentationController.php:14
* @route '/documentation'
*/
DocumentationControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: DocumentationController.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentationController::__invoke
* @see app/Http/Controllers/DocumentationController.php:14
* @route '/documentation'
*/
DocumentationControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: DocumentationController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

DocumentationController.form = DocumentationControllerForm

export default DocumentationController