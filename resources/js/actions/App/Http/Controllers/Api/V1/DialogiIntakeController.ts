import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\DialogiIntakeController::__invoke
* @see app/Http/Controllers/Api/V1/DialogiIntakeController.php:16
* @route '/api/v1/dialogi/intake'
*/
const DialogiIntakeController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: DialogiIntakeController.url(options),
    method: 'post',
})

DialogiIntakeController.definition = {
    methods: ["post"],
    url: '/api/v1/dialogi/intake',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\DialogiIntakeController::__invoke
* @see app/Http/Controllers/Api/V1/DialogiIntakeController.php:16
* @route '/api/v1/dialogi/intake'
*/
DialogiIntakeController.url = (options?: RouteQueryOptions) => {
    return DialogiIntakeController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\DialogiIntakeController::__invoke
* @see app/Http/Controllers/Api/V1/DialogiIntakeController.php:16
* @route '/api/v1/dialogi/intake'
*/
DialogiIntakeController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: DialogiIntakeController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\DialogiIntakeController::__invoke
* @see app/Http/Controllers/Api/V1/DialogiIntakeController.php:16
* @route '/api/v1/dialogi/intake'
*/
const DialogiIntakeControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DialogiIntakeController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\DialogiIntakeController::__invoke
* @see app/Http/Controllers/Api/V1/DialogiIntakeController.php:16
* @route '/api/v1/dialogi/intake'
*/
DialogiIntakeControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DialogiIntakeController.url(options),
    method: 'post',
})

DialogiIntakeController.form = DialogiIntakeControllerForm

export default DialogiIntakeController