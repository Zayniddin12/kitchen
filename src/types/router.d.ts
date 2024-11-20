import "vue-router";
import {RouteLocationRaw} from "vue-router";

declare module "vue-router" {
    interface RouteMeta {
        layout?: string;
        title?: string;
        breadcrumbItemTitle?: string;
        uniqueKeys?: Record<string, boolean>,
        apiUrl?: string;
        parentRouteTitle?: string;
        parentRouteUrl?: RouteLocationRaw,
        [key:string]: any,
    }
}
