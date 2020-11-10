import diffModel from './functions/diff-model';

self.onmessage = function (e) {
    const [ model, state ] = JSON.parse(e.data);

    const updates = diffModel(model, state);

    self.postMessage(updates);
}