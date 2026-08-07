import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import takeover from './takeover'
import message from './message'
/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
export const more = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: more.url(options),
    method: 'get',
})

more.definition = {
    methods: ["get","head"],
    url: '/dialogi/more',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
more.url = (options?: RouteQueryOptions) => {
    return more.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
more.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: more.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
more.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: more.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
const moreForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: more.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
moreForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: more.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DialogiMoreController::__invoke
* @see app/Http/Controllers/DialogiMoreController.php:15
* @route '/dialogi/more'
*/
moreForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: more.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

more.form = moreForm

/**
* @see \App\Http\Controllers\DialogiClearController::__invoke
* @see app/Http/Controllers/DialogiClearController.php:16
* @route '/dialogi/clear'
*/
export const clear = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clear.url(options),
    method: 'delete',
})

clear.definition = {
    methods: ["delete"],
    url: '/dialogi/clear',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DialogiClearController::__invoke
* @see app/Http/Controllers/DialogiClearController.php:16
* @route '/dialogi/clear'
*/
clear.url = (options?: RouteQueryOptions) => {
    return clear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DialogiClearController::__invoke
* @see app/Http/Controllers/DialogiClearController.php:16
* @route '/dialogi/clear'
*/
clear.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clear.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DialogiClearController::__invoke
* @see app/Http/Controllers/DialogiClearController.php:16
* @route '/dialogi/clear'
*/
const clearForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clear.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DialogiClearController::__invoke
* @see app/Http/Controllers/DialogiClearController.php:16
* @route '/dialogi/clear'
*/
clearForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clear.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

clear.form = clearForm

/**
* @see \App\Http\Controllers\DialogiSendController::__invoke
* @see app/Http/Controllers/DialogiSendController.php:25
* @route '/dialogi/send'
*/
export const send = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/dialogi/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DialogiSendController::__invoke
* @see app/Http/Controllers/DialogiSendController.php:25
* @route '/dialogi/send'
*/
send.url = (options?: RouteQueryOptions) => {
    return send.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DialogiSendController::__invoke
* @see app/Http/Controllers/DialogiSendController.php:25
* @route '/dialogi/send'
*/
send.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DialogiSendController::__invoke
* @see app/Http/Controllers/DialogiSendController.php:25
* @route '/dialogi/send'
*/
const sendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: send.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DialogiSendController::__invoke
* @see app/Http/Controllers/DialogiSendController.php:25
* @route '/dialogi/send'
*/
sendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: send.url(options),
    method: 'post',
})

send.form = sendForm

const dialogi = {
    more: Object.assign(more, more),
    clear: Object.assign(clear, clear),
    takeover: Object.assign(takeover, takeover),
    send: Object.assign(send, send),
    message: Object.assign(message, message),
}

export default dialogi