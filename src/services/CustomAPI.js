/** @format */
/**
 * TODO: need refactor
 */

import { Config, Tools } from "@common";
import { Platform } from "react-native";

/**
 * init class API
 * @param opt
 * @returns {WordpressAPI}
 * @constructor
 */
function WordpressAPI(opt) {
    if (!(this instanceof WordpressAPI)) {
        return new WordpressAPI(opt);
    }
    const newOpt = opt || {};
    this._setDefaultsOptions(newOpt);
}

/**
 * Default option
 * @param opt
 * @private
 */
WordpressAPI.prototype._setDefaultsOptions = async function (opt) {
    this.url = opt.url ? opt.url : Config.WooCommerce.url;
    this.lcepsKey = Config.lcepsKey;
};

WordpressAPI.prototype.createComment = async function (data, callback) {
    let requestUrl = `${this.url}/wp-json/api/flutter_user/post_comment/?insecure=cool`;
    if (data) {
        requestUrl += `&${this.join(data, "&")}`;
    }
    return this._request(requestUrl, data, callback);
};

WordpressAPI.prototype.join = (obj, separator) => {
    const arr = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            arr.push(`${key}=${obj[key]}`);
        }
    }

    return arr.join(separator);
};
WordpressAPI.prototype._request = function (url, callback) {
    const self = this;
    return fetch(url)
        .then((response) => response.text()) // Convert to text instead of res.json()
        .then((text) => {
            if (Platform.OS === "android") {
                text = text.replace(/\r?\n/g, "").replace(/[\u0080-\uFFFF]/g, ""); // If android , I've removed unwanted chars.
            }
            return text;
        })
        .then((response) => JSON.parse(response))

        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "WordpressAPI.prototype._request" });
            // console.log('1=error network -', error, data);
        })
        .then((responseData) => {
            if (typeof callback === "function") {
                callback();
            }
            // console.log('request result from ' + url, responseData);

            return responseData;
        })
        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "WordpressAPI.prototype._request" });
            // console.log('2=error network -- ', error.message);
        });
};

WordpressAPI.prototype.getCheckoutUrl = async function (data, callback) {
    const requestUrl = `${this.url}/wp-json/api/flutter_user/checkout`;
    fetch(requestUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((code) => {
            callback(`${this.url}/checkout?code=${code}&mobile=true`);
        })
        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "getCheckoutUrl" });
            alert("Ha ocurrido un error, vuelve a intentarlo");
        });
};

WordpressAPI.prototype.recoverPassword = async function (data, callback) {
    let requestUrl = `${this.url}/wp-json/devola/v1/users/recover-password`;
    if (data) {
        requestUrl += `?${this.join(data, "&")}`;
    }
    fetch(requestUrl, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((code) => {
            callback(code);
        })
        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "recoverPassword" });
            alert("Ha ocurrido un error, vuelve a intentarlo");
        });
};

WordpressAPI.prototype.getAddresses = async function (data, callback) {
    let requestUrl = `${this.url}/wp-json/devola/v1/users/address`;
    if (data) {
        requestUrl += `?${this.join(data, "&")}`;
    }
    fetch(requestUrl, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((code) => {
            callback(code);
        })
        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "getAddresses" });
            alert("Ha ocurrido un error, vuelve a intentarlo");
        });
};
WordpressAPI.prototype.ordersById = async function (orderId, callback) {
    let requestUrl = `${this.url}wp-json/wc/v3/orders/${orderId}`;

    requestUrl += `?consumer_key=${Config.WooCommerce.consumerKey}&consumer_secret=${Config.WooCommerce.consumerSecret}`;
    fetch(requestUrl, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((code) => {
            callback(code);
        })
        .then((response) => response.json())
        .then((code) => {
            callback(code);
        })
        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "ordersById" });
            alert("Ha ocurrido un error, vuelve a intentarlo");
        });
};


WordpressAPI.prototype.setAddresses = async function (data, callback) {
    const requestUrl = `${this.url}/wp-json/devola/v1/users/address`;
    fetch(requestUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((code) => {
            callback(code);
        })
        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "setAddresses" });
            alert("Ha ocurrido un error, vuelve a intentarlo");
        });
};

WordpressAPI.prototype.updateProfile = async function (data, callback) {
    const requestUrl = `${this.url}/wp-json/devola/v1/users/`;
    /*if (data) {
      requestUrl += `?${this.join(data, "&")}`;
    }*/
    fetch(requestUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((code) => {
            callback(code);
        })
        .then((response) => response.json())
        .then((code) => {
            callback(code);
        })
        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "updateProfile" });
            alert("Ha ocurrido un error, vuelve a intentarlo");
        });
};

WordpressAPI.prototype.setTokenNotification = async function (data, callback) {


    let requestUrl = `${this.url}?lceps_key=${Config.lcepsKey}&add_token=${data.token}`;
    /* if (data) {
         requestUrl += `?${this.join(data, "&")}`;
     }*/
    fetch(requestUrl, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((code) => {
            callback(code);
        })
        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "setTokenNotification" });
            alert("Ha ocurrido un error, vuelve a intentarlo");
        });


};

WordpressAPI.prototype.setMetaUser = async function (data, callback) {
    const requestUrl = `${this.url}wp-json/devola/v1/users/metaUser`;
    fetch(requestUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((code) => {
            callback(code);
        })
        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "setMetaUser" });
            alert("Ha ocurrido un error, vuelve a intentarlo");
        });
};

WordpressAPI.prototype.getMetaUser = async function (data, callback) {
    let requestUrl = `${this.url}/wp-json/devola/v1/users/metaUser`;
    if (data) {
        requestUrl += `?${this.join(data, "&")}`;
    }
    fetch(requestUrl, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((code) => {
            callback(code);
        })
        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "getMetaUser" });
            alert("Ha ocurrido un error, vuelve a intentarlo");
        });
};

WordpressAPI.prototype.getVersionApp = async function (callback) {
    let requestUrl = `${this.url}/wp-json/devola/v1/admin/version`;

    fetch(requestUrl, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((code) => {
            callback(code);
        })
        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "getVersionApp" });
            alert("Ha ocurrido un error, vuelve a intentarlo");
        });
};

WordpressAPI.prototype.GetPaymentMethods = async function (data, callback) {
    let requestUrl = `${this.url}/wp-json/devola/v1/users/paymetmethod/`;
    if (data) {
        requestUrl += `?${this.join(data, "&")}`;
    }
    fetch(requestUrl, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((code) => {
            callback(code);
        })
        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "GetPaymentMethods" });
            alert("Ha ocurrido un error, vuelve a intentarlo");
        });
};
WordpressAPI.prototype.deleteCard = async function (data, callback) {
    let requestUrl = `${this.url}/wp-json/devola/v1/users/paymetmethod`;
    fetch(requestUrl, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => { result: "ok" })
        .then((code) => {
            callback(code);
        })
        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "deleteCard" });
            alert("Ha ocurrido un error, vuelve a intentarlo");
        });
};

WordpressAPI.prototype.GetAllNotifications = async function (callback) {
    let requestUrl = `${this.url}/wp-json/devola/v1/users/Notification/`;

    fetch(requestUrl, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((code) => {
            callback(code);
        })
        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "GetAllNotifications" });
            alert("Ha ocurrido un error, vuelve a intentarlo");
        });
};

WordpressAPI.prototype.GetAllPromotions = async function (callback) {
    let requestUrl = `${this.url}/wp-json/devola/v1/users/promotions/`;

    fetch(requestUrl, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((code) => {
            callback(code);
        })
        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "GetAllPromotions" });
            alert("Ha ocurrido un error, vuelve a intentarlo");
        });
};

WordpressAPI.prototype.GetOrdersByStatus = async function (data, callback) {
    let requestUrl = `${this.url}/wp-json/wc/v3/orders/?customer=${data.userId}&status=${data.status}&per_page=40&page=1&consumer_key=ck_974d5b0b4037bd59bff4ff736aa3e38755e3a297&consumer_secret=cs_d8e7e97f0ef8d7fac418a2409b376d46876f9d70`;

    fetch(requestUrl, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((code) => {
            callback(code);
        })
        .catch((error, data) => {
            Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "GetOrdersByStatus" });
            alert("Ha ocurrido un error, vuelve a intentarlo");
        });
};


WordpressAPI.prototype.sendDataPixelFacebook = async function (data, callback) {
   // alert("HOLA SERVICE"+ JSON.stringify(data));
    const requestUrl = `https://graph.facebook.com/v9.0/1047446912673787/events`;
    fetch(requestUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((code) => {
        //    alert("se envio "+ JSON.stringify(code))
            callback(code);
        })
        .catch((error, data) => {
         //   Tools.sendFirebaseNotificacionLogs({ error: JSON.stringify(error), data: JSON.stringify(data), method: "sendDataPixelFacebook" });
            alert("Ha ocurrido un error, vuelve a intentarlo");
        });
};


export default new WordpressAPI();