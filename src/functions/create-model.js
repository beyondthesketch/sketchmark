import {DIRECTIVES, DIRECTIVE_NAMES, DIRECTIVE_SEPARATORS} from './../constants/directives';
import SKETCHMARK_REGISTRY from './../constants/registry';
import statefulObject from 'statefulobjects';
import SKETCHMARK_ATTRIBUTE_PREFIX from '../constants/sketchmark-attributes';

function directiveSwitch(element, directive) {
    switch (directive) {
        case DIRECTIVE_NAMES.ATTR:
            const [attr] = element.dataset.smAttr.split(DIRECTIVE_SEPARATORS.ATTR);
            return element.getAttribute(attr);
        case DIRECTIVE_NAMES.SHOW:
            return !(element.style.display === 'none' || window.getComputedStyle(element).display === 'none');
        case DIRECTIVE_NAMES.CONTENT:
            return element.textContent;
    }
}

export default function createModel(source, lifecycles, nodes) {
    const model = {
        source,
        ...lifecycles,
    };

    const appProps = [];

    DIRECTIVES.forEach(
        (d) => {
            nodes.forEach(
                (element) => {
                    if (element.hasAttribute(`${SKETCHMARK_ATTRIBUTE_PREFIX}-${d}`)) {
                        const ref = element.getAttribute(`${SKETCHMARK_ATTRIBUTE_PREFIX}-ref`);
                        model[ref] = model[ref] || {};

                        model[ref][d] = [
                            element.getAttribute(`${SKETCHMARK_ATTRIBUTE_PREFIX}-${d}`),
                            directiveSwitch(element, d),
                        ];

                        const foo = [
                            element.getAttribute(`${SKETCHMARK_ATTRIBUTE_PREFIX}-${d}`),
                            directiveSwitch(element, d)
                        ];
                        if (!appProps.find( (el) => foo.toString() === el.toString())) {
                            appProps.push(foo);
                        }
                    }
                }
            )
        }
    );

    const appObj = {};
    appProps.forEach(
        (prop) => {
            appObj[prop[0]] = prop[1];
        }
    );

    SKETCHMARK_REGISTRY[model.source] = statefulObject(appObj);

    model.nodes = nodes;

    return model;
}
