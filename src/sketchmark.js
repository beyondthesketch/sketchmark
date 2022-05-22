import SKETCHMARK_REGISTRY from './constants/registry';
import createModel from './functions/create-model';
import fetchTemplate from './functions/fetch-templates';
import updateModel from './functions/update-model';
import { SketchmarkWorker } from './worker/worker';
import renderUpdates from './functions/render-updates';

function handleUpdates(msg) {
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
        // **> preUpdate
        this.preUpdate();
        // **> preRender
        this.preRender();
        renderUpdates(updates, this.template);
        // **> postUpdate;
        this.postUpdate();
        // **> postRender
        this.postRender();
    }

    return updates;
}

// @TODO: Wrap this in function? so that attempts to reinit existing views does not return anything and does not register a var/const/let
export default class Sketchmark {
    #model;
    #sketchmarkModel;
    constructor(source, config = {}) {
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
        const model = fetchTemplate(source);
        const sketchmarkModel = createModel(source, lifecycles, model[source], model.repeats);
        this.#model = model;
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
                state.subscribe[i](i, () => {
                    updateModel(this.#sketchmarkModel);
                });
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
            handleUpdates.bind(this.#sketchmarkModel)
        );

    }

    get _model() {
        return this.#sketchmarkModel;
    }

    set _model(x) {
        this.#sketchmarkModel = x;
    }
}