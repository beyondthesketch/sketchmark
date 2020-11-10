import SKETCHMARK_REGISTRY from './../constants/registry';
import { SketchmarkWorker } from './../worker/worker';

export default function updateModel(model) {
    SketchmarkWorker.postMessage(
        JSON.stringify([model, SKETCHMARK_REGISTRY[model.source]])
    );
}
