import {DIRECTIVES} from '../constants/directives';
import SKETCHMARK_ATTRIBUTE_PREFIX from './../constants/sketchmark-attributes';

export default function fetchTemplate(source) {

    // console.log('fetch template', this);

    const frags = document.createDocumentFragment();
    const model = {
        [source]: []
    };
    const markup = document.querySelectorAll(`[${SKETCHMARK_ATTRIBUTE_PREFIX}-source="${source}"]`);

    // get the markup
    markup
        .forEach(
            (elm) => {
                let refCache;
                // ref the markup for basic directives
                DIRECTIVES
                    .forEach(
                        (d) => {
                            elm.querySelectorAll(`[${SKETCHMARK_ATTRIBUTE_PREFIX}-${d}]`)
                                .forEach(
                                    (element) => {
                                        const id = crypto.getRandomValues(new Uint32Array(1))[0];
                                        if (!element.hasAttribute('data-rp')) {
                                            refCache = id;
                                        }

                                        if (!element.dataset.smRef) {
                                            element.dataset.smRef = element.hasAttribute('data-rp') && refCache
                                                ? refCache
                                                : id; // add id refs to the markup/template on the DOM
                                        }
                                    }
                                )
                        }
                    );

                const template = elm.cloneNode(true);

                // remove subviews
                template.querySelectorAll(`[${SKETCHMARK_ATTRIBUTE_PREFIX}-source]`)
                    .forEach(
                        (el) => el.parentElement.removeChild(el)
                    );

                frags.appendChild(template);
            }
        );

    DIRECTIVES.forEach(
        (d) => {
            frags.querySelectorAll(`[${SKETCHMARK_ATTRIBUTE_PREFIX}-${d}]`)
                .forEach(
                    (e) => model[source].push(e)
                );
        }
    );

    return model;
}