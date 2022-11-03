import { DIRECTIVE_NAMES, DIRECTIVE_SEPARATORS } from './../constants/directives';
import SKETCHMARK_ATTRIBUTE_PREFIX from './../constants/sketchmark-attributes';

const refs = new Map();

export default function renderUpdates(updates = [], template) {
    updates.length && updates.forEach(
        ([id, type, key, val]) => {
            const el = refs.has(id) ? refs.get(id) : (
                refs.set(id, document.querySelector(`[${SKETCHMARK_ATTRIBUTE_PREFIX}-ref="${id}"]`)) &&
                refs.get(id)
            );

            !PROD && console?.log(refs);

            // attributes
            switch (type) {
                case DIRECTIVE_NAMES.ATTR:
                    !!val ? el.setAttribute(key.substring(0, key.indexOf(DIRECTIVE_SEPARATORS.ATTR)), val) : el.removeAttribute(key.substring(0, key.indexOf(DIRECTIVE_SEPARATORS.ATTR)));
                    break;
                case DIRECTIVE_NAMES.SHOW:
                    !!val ? el.style.display && (el.style.display = '') : el.style.display = 'none';
                    break;
                case DIRECTIVE_NAMES.CONTENT:
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
