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

    renderUpdates(updates, this.template);

    return updates;
}


export default class Sketchmark {
    #model;
    #sketchmarkModel;
    constructor(source) {
        if (SKETCHMARK_REGISTRY[source]) {
            console && console.warn(`'${source}' view already initialised! To reinitialise this view, you must first quit the current view`);
            return;
        }

        const model = fetchTemplate(source);
        const sketchmarkModel = createModel(source, model[source], model.repeats);
        this.#model = model;
        this.#sketchmarkModel = sketchmarkModel;
        this.quit = () => {
            // QUESTION: Move this to the same module as create-model or another module?
            delete SKETCHMARK_REGISTRY[source];
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