export function statefulObject(model) {
    const callbacksModel = {};
    Object.keys(model).forEach(
        (key) => callbacksModel[key] = [],
    );

    return new Proxy(
        model,
        {
            get() {
                return Reflect.get(...arguments);
            },
            set(obj, prop, value) {
                const [ stateKey, callbackFn ] = value;

                if (
                    prop === 'subscribe'
                    && typeof stateKey === 'string'
                    && typeof callbackFn === 'function'
                ) {
                    if (!callbacksModel[stateKey].find((fn) => fn === callbackFn)) {
                        callbacksModel[stateKey].push(callbackFn);
                    }
                }
                if (
                    prop === 'unsubscribe'
                    && typeof stateKey === 'string'
                    && typeof value === 'function'
                ) {
                    if (callbacksModel[stateKey].find((fn) => fn === value)) {
                        callbacksModel[stateKey].splice(
                            callbacksModel[stateKey].findIndex((fn) => fn === value),
                            1
                        );
                    }
                }

                obj[prop] = value;

                if (
                    !['subscribe', 'unsubscribe'].includes(prop)
                ) {
                    !PROD && console?.log(`set property '${prop}' with: `, value);
                    callbacksModel[prop].length && callbacksModel[prop].forEach(
                        (fn) => fn()
                    );
                }

                return true;
            }
        }
    );
}