import {DIRECTIVES, DIRECTIVE_SEPARATORS, META_DIRECTIVES} from '../constants/directives';
import SKETCHMARK_ATTRIBUTE_PREFIX from './../constants/sketchmark-attributes';

let refCache;

function refDomNode(element) {
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

function metaDirectiveSwitch(element, methods) {
    const [ handler, fnName ] = element.dataset.smEvent.split(DIRECTIVE_SEPARATORS.EVENT);

    element.addEventListener(handler, methods[fnName]);
}

export default function fetchTemplate(source, methods) {
    const frags = document.createDocumentFragment();
    const model = {
        [source]: []
    };
    const markup = document.querySelectorAll(`[${SKETCHMARK_ATTRIBUTE_PREFIX}-source="${source}"]`);

    // get the markup
    markup
        .forEach(
            (elm) => {
                // ref the markup for basic directives
                DIRECTIVES
                    .forEach(
                        (d) => {
                            elm.querySelectorAll(`[${SKETCHMARK_ATTRIBUTE_PREFIX}-${d}]`)
                                .forEach((element) => refDomNode(element, refCache));
                        }
                    );

                META_DIRECTIVES
                    .forEach(
                        (md) => {
                            elm.querySelectorAll(`[${SKETCHMARK_ATTRIBUTE_PREFIX}-${md}]`)
                                .forEach((element) => {
                                    refDomNode(element, refCache);

                                    // apply metas
                                    metaDirectiveSwitch(element, methods);
                                });
                        }
                    )

                const template = elm.cloneNode(true);

                // remove subviews & repeats
                template.querySelectorAll(
                    `[${SKETCHMARK_ATTRIBUTE_PREFIX}-source], [data-rp]`)
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