import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\IntegrationsController::edit
* @see app/Http/Controllers/Settings/IntegrationsController.php:14
* @route '/settings/integrations'
*/
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/integrations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\IntegrationsController::edit
* @see app/Http/Controllers/Settings/IntegrationsController.php:14
* @route '/settings/integrations'
*/
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\IntegrationsController::edit
* @see app/Http/Controllers/Settings/IntegrationsController.php:14
* @route '/settings/integrations'
*/
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\IntegrationsController::edit
* @see app/Http/Controllers/Settings/IntegrationsController.php:14
* @route '/settings/integrations'
*/
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Settings\IntegrationsController::edit
* @see app/Http/Controllers/Settings/IntegrationsController.php:14
* @route '/settings/integrations'
*/
const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\IntegrationsController::edit
* @see app/Http/Controllers/Settings/IntegrationsController.php:14
* @route '/settings/integrations'
*/
editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Settings\IntegrationsController::edit
* @see app/Http/Controllers/Settings/IntegrationsController.php:14
* @route '/settings/integrations'
*/
editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\Settings\IntegrationsController::update
* @see app/Http/Controllers/Settings/IntegrationsController.php:27
* @route '/settings/integrations'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/settings/integrations',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Settings\IntegrationsController::update
* @see app/Http/Controllers/Settings/IntegrationsController.php:27
* @route '/settings/integrations'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\IntegrationsController::update
* @see app/Http/Controllers/Settings/IntegrationsController.php:27
* @route '/settings/integrations'
*/
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Settings\IntegrationsController::update
* @see app/Http/Controllers/Settings/IntegrationsController.php:27
* @route '/settings/integrations'
*/
const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\IntegrationsController::update
* @see app/Http/Controllers/Settings/IntegrationsController.php:27
* @route '/settings/integrations'
*/
updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Settings\IntegrationsController::destroy
* @see app/Http/Controllers/Settings/IntegrationsController.php:40
* @route '/settings/integrations'
*/
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/integrations',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Settings\IntegrationsController::destroy
* @see app/Http/Controllers/Settings/IntegrationsController.php:40
* @route '/settings/integrations'
*/
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\IntegrationsController::destroy
* @see app/Http/Controllers/Settings/IntegrationsController.php:40
* @route '/settings/integrations'
*/
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Settings\IntegrationsController::destroy
* @see app/Http/Controllers/Settings/IntegrationsController.php:40
* @route '/settings/integrations'
*/
const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Settings\IntegrationsController::destroy
* @see app/Http/Controllers/Settings/IntegrationsController.php:40
* @route '/settings/integrations'
*/
destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const integrations = {
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default integrations