import DIRECTIVES from './../constants/directives';
import SKETCHMARK_REGISTRY from './../constants/registry';
import statefulObject from 'statefulobjects';
import SKETCHMARK_ATTRIBUTE_PREFIX from '../constants/sketchmark-attributes';

export default function createModel(source, nodes) {
    const model = {
        source,
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
                            d === 'show'
                                ? !(element.style.display === 'none' || window.getComputedStyle(element).display === 'none')
                                : element.textContent
                        ];

                        const foo = [
                            element.getAttribute(`${SKETCHMARK_ATTRIBUTE_PREFIX}-${d}`),
                            d === 'show'
                                ? !(element.style.display === 'none' || window.getComputedStyle(element).display === 'none')
                                : element.textContent
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
