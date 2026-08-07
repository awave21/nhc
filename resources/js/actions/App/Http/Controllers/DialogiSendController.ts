import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DialogiSendController::__invoke
* @see app/Http/Controllers/DialogiSendController.php:25
* @route '/dialogi/send'
*/
const DialogiSendController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: DialogiSendController.url(options),
    method: 'post',
})

DialogiSendController.definition = {
    methods: ["post"],
    url: '/dialogi/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DialogiSendController::__invoke
* @see app/Http/Controllers/DialogiSendController.php:25
* @route '/dialogi/send'
*/
DialogiSendController.url = (options?: RouteQueryOptions) => {
    return DialogiSendController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DialogiSendController::__invoke
* @see app/Http/Controllers/DialogiSendController.php:25
* @route '/dialogi/send'
*/
DialogiSendController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: DialogiSendController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DialogiSendController::__invoke
* @see app/Http/Controllers/DialogiSendController.php:25
* @route '/dialogi/send'
*/
const DialogiSendControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DialogiSendController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DialogiSendController::__invoke
* @see app/Http/Controllers/DialogiSendController.php:25
* @route '/dialogi/send'
*/
DialogiSendControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: DialogiSendController.url(options),
    method: 'post',
})

DialogiSendController.form = DialogiSendControllerForm

export default DialogiSendController