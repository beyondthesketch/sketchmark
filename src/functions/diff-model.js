export default function diffModel(model, state) {
    const newModel = {...model};
    delete newModel.source;
    delete newModel.template;
    delete newModel.nodes;
    const k = Object.entries(newModel);

    const update = [];

    k.forEach(
        (item) => {
            const [id, dir] = item;
            const keys = Object.keys(dir);

            keys.forEach(
                (k) => {
                    const dirIsArray = Array.isArray(dir[k][1]);

                    if (
                        (dirIsArray && ('' + [...dir[k][1]].reverse() !== '' + state[dir[k][0]]))
                        || (!dirIsArray && (dir[k][1] !== state[dir[k][0]])) // right one for text
                    ) {
                        update.push([id, k, dir[k][0], state[dir[k][0]]]);
                    }
                }
            )
            
        }
    )

    !PROD && console?.log(update.length > 0 ? 'Updates needed' : 'No Updates', update);
    
    return update;
}
