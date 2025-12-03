/**
 * Namespace Env
 *
 * It is used to declare the type of the import.meta object
 */
declare namespace Env {
    /** The router history mode */
    type RouterHistoryMode = 'hash' | 'history' | 'memory'

    /** Interface for import.meta */
    interface ImportMeta extends ImportMetaEnv {
        /** The base api url of the application */
        readonly VITE_API_URL: string
        /** The base url of the application */
        readonly VITE_BASE_URL: string

        readonly VITE_AUTHING_URL: string
        readonly VITE_AUTHING_APPID: string

        // 自动创建权限
        readonly VITE_AUTO_CREATE_PERMISSION: string

        /** The description of the application */
        readonly VITE_APP_DESC: string
        /** The title of the application */
        readonly VITE_APP_TITLE: string
        /**
         * The authenication route mode
         *
         * - Static: the authenication routes are generated in front-end
         * - Dynamic: the authenication routes are generated in the back-end
         */
        readonly VITE_AUTH_ROUTE_MODE: 'dynamic' | 'static'

        readonly VITE_CONSTANT_ROUTE_MODE: 'dynamic' | 'static'

        /** The prefix of the iconify icon */
        readonly VITE_ICON_PREFIX: 'icon'
        /**
         * Iconify api provider url
         *
         * If the project is deployed in intranet, you can set the api provider url to the local iconify server
         *
         * @link https://docs.iconify.design/api/providers.html
         */
        readonly VITE_ICONIFY_URL?: string
        /**
         * Default menus icon if menus icon is not set
         *
         * Iconify icon name
         */
        readonly VITE_MENU_ICON: string
        /**
         * other backend service base url
         *
         * the value is a JSON
         */
        readonly VITE_OTHER_SERVICE_BASE_URL: string

        /**
         * The home route key
         *
         * It only has effect when the authenication route mode is static, if the route mode is dynamic, the home route key is
         * defined in the back-end
         */
        readonly VITE_ROUTE_HOME: string
        /** The router history mode */
        readonly VITE_ROUTER_HISTORY_MODE?: RouterHistoryMode
        /** backend service base url */
        readonly VITE_SERVICE_BASE_URL: string

        /**
         * token expired codes of backend service
         *
         * when the code is received, it will refresh the token and resend the request
         *
         * use "," to separate multiple codes
         */
        readonly VITE_SERVICE_EXPIRED_TOKEN_CODES: string
        /**
         * logout codes of backend service
         *
         * when the code is received, the customers will be logged out and redirected to login page
         *
         * use "," to separate multiple codes
         */
        readonly VITE_SERVICE_LOGOUT_CODES: string
        /**
         * modal logout codes of backend service
         *
         * when the code is received, the customers will be logged out by displaying a modal
         *
         * use "," to separate multiple codes
         */
        readonly VITE_SERVICE_MODAL_LOGOUT_CODES: string
        /**
         * success code of backend service
         *
         * when the code is received, the request is successful
         */
        readonly VITE_SERVICE_SUCCESS_CODE: string

        /** when the route mode is static, the defined super role */
        readonly VITE_STATIC_SUPER_ROLE: string
        /** Used to differentiate storage across different domains */
        readonly VITE_STORAGE_PREFIX?: string
    }
}
