import SKETCHMARK_ATTRIBUTE_PREFIX from './../constants/sketchmark-attributes';

export default function renderUpdates(updates = [], template) {
    updates.length && updates.forEach(
        ([id, type, key, val]) => {
            const el = document.querySelector(`[${SKETCHMARK_ATTRIBUTE_PREFIX}-ref="${id}"]`);

            // attributes
            switch (type) {
                case 'attr':
                    !!val ? el.setAttribute(key.substring(0, key.indexOf(':')), val) : el.removeAttribute(key.substring(0, key.indexOf(':')));
                    break;
                case 'show':
                    !!val ? el.style.display && (el.style.display = '') : el.style.display = 'none';
                    break;
                case 'content':
                    // delete duplicate ids
                    el.parentElement
                        .querySelectorAll(`[${SKETCHMARK_ATTRIBUTE_PREFIX}-ref="${id}"]`)
                        .forEach(
                            (elm, i) => {
                                i !== 0 && el.parentElement.removeChild(elm);
                            }
                        )
                    if (Array.isArray(val)) {
                        val.reverse().forEach(
                            (v, i) => {
                                if (i !== (val.length - 1)) {
                                    const cloneEl = el.cloneNode(true);
                                    cloneEl.textContent = v;
                                    el.insertAdjacentElement(
                                        'afterend',
                                        cloneEl
                                    );
                                } else {
                                    el.textContent = v;
                                }
                            }
                        );
                        el.dataset.index = true;
                    } else {
                        el.textContent = val;
                    }
                    break;
            }
            
        }
    )


}
