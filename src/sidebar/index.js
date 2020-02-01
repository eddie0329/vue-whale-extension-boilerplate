import Vue from "vue";
import "bulma-fluent/bulma.sass";

import App from "./App.vue";

// eslint-disable-next-line
new Vue({
    el: "#app",
    render: h => h(App)
});

/** ****************************************************************************
 *                                 HOT RELOAD                                   *
 *******************************************************************************/
(function hotReload() {
    whale.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message === "reload") {
            location.reload();
            sendResponse("RELOAD_SUCCESS");
        }
        return true;
    });
})();
/** ****************************************************************************/
