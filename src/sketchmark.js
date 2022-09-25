import SKETCHMARK_REGISTRY from './constants/registry';
import SKETCHMARK_ATTRIBUTE_PREFIX from './constants/sketchmark-attributes';
import createModel from './functions/create-model';
import fetchTemplate from './functions/fetch-templates';
import updateModel from './functions/update-model';
import { SketchmarkWorker } from './worker/worker';
import renderUpdates from './functions/render-updates';

function setAppUpdating(status) {
    this.roots.forEach((el) => 
        status
            ? el.dataset.smUpdating = 'true'
            : el.removeAttribute('data-sm-updating')
    );
}

function handleUpdates(msg, app) {
    const appUpdating = setAppUpdating.bind(app);
    const { data } = msg;
    const updates = data;

    updates && updates.length && updates.forEach(
        (item) => {
            const [id, type, prop, val] = item;
            this[id] = {
                ...this[id],
                [type]: [prop, val]
            };
        }
    );

    if (updates && updates.length) {
        // event approach
        const updatingEvent = new CustomEvent(
            'update',
            {
                detail: {
                    updates
                }
            }
        );
        app.dispatchEvent(updatingEvent);

        appUpdating(true);

        // **> preUpdate
        console.log(this.preUpdate.constructor.name);
        this.preUpdate();
        // **> preRender
        this.preRender();

        renderUpdates(updates, this.root);

        // **> postRender
        this.postRender();
        // **> postUpdate;
        this.postUpdate();

        appUpdating(false);
    }

    return updates;
}

// @TODO: Wrap this in function? so that attempts to reinit existing views does not return anything and does not register a var/const/let
export default class Sketchmark extends EventTarget {
    #root;
    #sketchmarkModel;

    constructor(source, config = {}) {
        super();
        if (SKETCHMARK_REGISTRY[source]) {
            console && console.warn(`'${source}' view already initialised! To reinitialise this view, you must first quit the current view`);
            console && console.warn(`...this instance will be an alias for'${source}'`);
            return SKETCHMARK_REGISTRY[source];
        }

        const {
            preInit = () => void 0,
            postInit = () => void 0,
            preQuit = () => void 0,
            postQuit = () => void 0,
            preUpdate = () => void 0,
            postUpdate = () => void 0,
            preRender = () => void 0,
            postRender = () => void 0,
        } = config;

        const lifecycles = {
            preUpdate,
            postUpdate,
            preRender,
            postRender,
        }

        // **> preInit
        preInit();
        
        // ==> initialise
        const model = fetchTemplate.call(this, source);
        this.nodes = model;

        const sketchmarkModel = createModel(source, lifecycles, model[source], model.repeats);

        this.#root = document.querySelectorAll(`[${SKETCHMARK_ATTRIBUTE_PREFIX}-source="${source}"]`);

        this.#sketchmarkModel = sketchmarkModel;

        // **> postInit
        postInit();

        // instance methods
        this.quit = () => {
            // **> preQuit
            preQuit();

            // QUESTION: Move this to the same module as create-model or another module?
            delete SKETCHMARK_REGISTRY[source];
            
            // **> postQuit
            postQuit();
        };

        const state = SKETCHMARK_REGISTRY[source];

        for (const i in state) {
            if (state.hasOwnProperty(i)) {
                state.subscribe = [i, () => {
                    updateModel(this.#sketchmarkModel);
                }]
                // create a public proxy to the stateful object
                Object.defineProperty(
                    this,
                    i,
                    {
                        get() {
                            return state[i]
                        },
                        set(x) {
                            state[i] = x;
                        }
                    }
                )
            }
        }

        SketchmarkWorker.addEventListener(
            'message',
            (msg) => handleUpdates.bind(this.#sketchmarkModel)(msg, this)
        );
    }

    get roots() {
        return this.#root;
    }

    get _model() {
        return this.#sketchmarkModel;
    }

    set _model(x) {
        this.#sketchmarkModel = x;
    }
}