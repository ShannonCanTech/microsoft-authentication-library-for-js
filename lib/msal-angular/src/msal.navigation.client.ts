/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { NavigationClient, NavigationOptions, UrlString } from "@azure/msal-browser";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { MsalService } from "./msal.service";

/**
 * Custom navigation used for Angular client-side navigation.
 * See performance doc for details:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular/docs/v2-docs/performance.md
 */
export class MsalCustomNavigationClient extends NavigationClient {

    constructor(
        private authService: MsalService,
        private router: Router, 
        private location: Location
    ) {
        super();
        this.router = router;
        this.location = location;
    }

    async navigateInternal(url:string, options: NavigationOptions): Promise<boolean> {
        this.authService.getLogger().verbose("MsalCustomNavigationClient called");
        const urlComponents = new UrlString(url).getUrlComponents();

        // Normalizing newUrl if no query string
        const newUrl = urlComponents.QueryString ? `${urlComponents.AbsolutePath}?${urlComponents.QueryString}` : this.location.normalize(urlComponents.AbsolutePath);

        // Replaces current state if noHistory flag set to true
        this.router.navigateByUrl(newUrl, { replaceUrl: options.noHistory});

        return Promise.resolve(false);
    }
}
