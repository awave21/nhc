import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
* @route '/login'
*/
loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

login.form = loginForm

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
* @route '/logout'
*/
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
* @route '/logout'
*/
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
* @route '/logout'
*/
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
* @route '/logout'
*/
const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
})

/**
* @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
* @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
* @route '/logout'
*/
logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
})

logout.form = logoutForm

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: register.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: register.url(options),
    method: 'get',
})

/**
* @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
* @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
* @route '/register'
*/
registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: register.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

register.form = registerForm

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

home.form = homeForm

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:17
* @route '/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:17
* @route '/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:17
* @route '/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:17
* @route '/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:17
* @route '/dashboard'
*/
const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:17
* @route '/dashboard'
*/
dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::__invoke
* @see app/Http/Controllers/DashboardController.php:17
* @route '/dashboard'
*/
dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

dashboard.form = dashboardForm

/**
* @see \App\Http\Controllers\DialogiController::__invoke
* @see app/Http/Controllers/DialogiController.php:19
* @route '/dialogi'
*/
export const dialogi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dialogi.url(options),
    method: 'get',
})

dialogi.definition = {
    methods: ["get","head"],
    url: '/dialogi',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DialogiController::__invoke
* @see app/Http/Controllers/DialogiController.php:19
* @route '/dialogi'
*/
dialogi.url = (options?: RouteQueryOptions) => {
    return dialogi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DialogiController::__invoke
* @see app/Http/Controllers/DialogiController.php:19
* @route '/dialogi'
*/
dialogi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dialogi.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DialogiController::__invoke
* @see app/Http/Controllers/DialogiController.php:19
* @route '/dialogi'
*/
dialogi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dialogi.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DialogiController::__invoke
* @see app/Http/Controllers/DialogiController.php:19
* @route '/dialogi'
*/
const dialogiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dialogi.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DialogiController::__invoke
* @see app/Http/Controllers/DialogiController.php:19
* @route '/dialogi'
*/
dialogiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dialogi.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DialogiController::__invoke
* @see app/Http/Controllers/DialogiController.php:19
* @route '/dialogi'
*/
dialogiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dialogi.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

dialogi.form = dialogiForm

/**
* @see \App\Http\Controllers\OrderController::__invoke
* @see app/Http/Controllers/OrderController.php:15
* @route '/order'
*/
export const order = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: order.url(options),
    method: 'get',
})

order.definition = {
    methods: ["get","head"],
    url: '/order',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::__invoke
* @see app/Http/Controllers/OrderController.php:15
* @route '/order'
*/
order.url = (options?: RouteQueryOptions) => {
    return order.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::__invoke
* @see app/Http/Controllers/OrderController.php:15
* @route '/order'
*/
order.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: order.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::__invoke
* @see app/Http/Controllers/OrderController.php:15
* @route '/order'
*/
order.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: order.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderController::__invoke
* @see app/Http/Controllers/OrderController.php:15
* @route '/order'
*/
const orderForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: order.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::__invoke
* @see app/Http/Controllers/OrderController.php:15
* @route '/order'
*/
orderForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: order.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::__invoke
* @see app/Http/Controllers/OrderController.php:15
* @route '/order'
*/
orderForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: order.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

order.form = orderForm

/**
* @see \App\Http\Controllers\UserProfilesController::__invoke
* @see app/Http/Controllers/UserProfilesController.php:16
* @route '/user-profiles'
*/
export const userProfiles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userProfiles.url(options),
    method: 'get',
})

userProfiles.definition = {
    methods: ["get","head"],
    url: '/user-profiles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserProfilesController::__invoke
* @see app/Http/Controllers/UserProfilesController.php:16
* @route '/user-profiles'
*/
userProfiles.url = (options?: RouteQueryOptions) => {
    return userProfiles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserProfilesController::__invoke
* @see app/Http/Controllers/UserProfilesController.php:16
* @route '/user-profiles'
*/
userProfiles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userProfiles.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserProfilesController::__invoke
* @see app/Http/Controllers/UserProfilesController.php:16
* @route '/user-profiles'
*/
userProfiles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: userProfiles.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserProfilesController::__invoke
* @see app/Http/Controllers/UserProfilesController.php:16
* @route '/user-profiles'
*/
const userProfilesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userProfiles.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserProfilesController::__invoke
* @see app/Http/Controllers/UserProfilesController.php:16
* @route '/user-profiles'
*/
userProfilesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userProfiles.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\UserProfilesController::__invoke
* @see app/Http/Controllers/UserProfilesController.php:16
* @route '/user-profiles'
*/
userProfilesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userProfiles.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

userProfiles.form = userProfilesForm

/**
* @see \App\Http\Controllers\AppealsController::__invoke
* @see app/Http/Controllers/AppealsController.php:15
* @route '/appeals'
*/
export const appeals = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: appeals.url(options),
    method: 'get',
})

appeals.definition = {
    methods: ["get","head"],
    url: '/appeals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AppealsController::__invoke
* @see app/Http/Controllers/AppealsController.php:15
* @route '/appeals'
*/
appeals.url = (options?: RouteQueryOptions) => {
    return appeals.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AppealsController::__invoke
* @see app/Http/Controllers/AppealsController.php:15
* @route '/appeals'
*/
appeals.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: appeals.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppealsController::__invoke
* @see app/Http/Controllers/AppealsController.php:15
* @route '/appeals'
*/
appeals.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: appeals.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AppealsController::__invoke
* @see app/Http/Controllers/AppealsController.php:15
* @route '/appeals'
*/
const appealsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: appeals.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppealsController::__invoke
* @see app/Http/Controllers/AppealsController.php:15
* @route '/appeals'
*/
appealsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: appeals.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AppealsController::__invoke
* @see app/Http/Controllers/AppealsController.php:15
* @route '/appeals'
*/
appealsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: appeals.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

appeals.form = appealsForm

/**
* @see \App\Http\Controllers\DocumentationController::__invoke
* @see app/Http/Controllers/DocumentationController.php:14
* @route '/documentation'
*/
export const documentation = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: documentation.url(options),
    method: 'get',
})

documentation.definition = {
    methods: ["get","head"],
    url: '/documentation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentationController::__invoke
* @see app/Http/Controllers/DocumentationController.php:14
* @route '/documentation'
*/
documentation.url = (options?: RouteQueryOptions) => {
    return documentation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentationController::__invoke
* @see app/Http/Controllers/DocumentationController.php:14
* @route '/documentation'
*/
documentation.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: documentation.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentationController::__invoke
* @see app/Http/Controllers/DocumentationController.php:14
* @route '/documentation'
*/
documentation.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: documentation.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DocumentationController::__invoke
* @see app/Http/Controllers/DocumentationController.php:14
* @route '/documentation'
*/
const documentationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: documentation.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentationController::__invoke
* @see app/Http/Controllers/DocumentationController.php:14
* @route '/documentation'
*/
documentationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: documentation.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DocumentationController::__invoke
* @see app/Http/Controllers/DocumentationController.php:14
* @route '/documentation'
*/
documentationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: documentation.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

documentation.form = documentationForm
