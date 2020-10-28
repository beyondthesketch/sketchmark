# SketchMark
## A JavaScript Experiment
### A library that behaves like a view library for website content

This experiment attempts to provide a solution to creating dynamic/reactive content for websites, but with less focus on the JavaScript and more on the markup.

That is to say, writing valid HTML markup, which the library will pick up and update, when needed, without having to make complex DOM traversals.

## Motivation

Front end view libraries and frameworks do a great job of building highly responsive, reactive, performant and slick user interfaces. They work great for building SPAs, because they are generally  mainly complex UIs that load content into a viewer of some sort.

However, for websites, which are generally composed more of content with simpler UIs, these types of solutions introduce a few challenges specific challenges:

- Big JavaScript bundles - Where the structures holding the content are client side generated (i.e. components), the JS bundles that are downloaded and executed grow larger, which generally leads to...
- Lots of main thread work - This can lead to significant performance impacts.
- Content is not part of the HTML markup - this can have certain SEO implications for websites, where SEO is a big factor to it's success, leading to the need for...
- Server Side Rendering - In order to ensure content is delivered in the HTML response so it can be crawled as well as improve speeds for first contentful paint. This brings about the need for...
- Elaborate toolchaining and build pipelines - So that the JavaScript components can be rendered as static markup to be served to the client, so that the JavaScript bundles can then be downloaded and 'hydrate' the views with reactive components

This means that in most cases where it is the site's content that is the subject of these components, and the components are operating on a multipage website, potentially with no central state management, which will reinitialise everything for every page load - there's a lot of overhead for what should be a simple effect. It's sort of like using a sledge hammer to hammer in a panel pin.

## Goals/Objectives

- Be a library (not a framework) for building dynamic content, not UI: most view libraries are great for, and/or specifically designed around building reactive and dynamic UIs and SPAs, not reactive and dynamic content for websites and PWAs.
- Write HTML first: most view libraries and front end framework work JS -> HTML, we wanted to see if it could be more HTML -> JS
- Make it work just as well without a toolchain or build pipeline: most libraries can be used without a build pipeline, but they are better when in one. We want something where we can write plain ole’ html + JS, without any need or benefit gained from compiling or building anything. - I.e. you should be able to write thing with extreme ease using nothing but a plain text editor.
- Leverage multithreaded JavaScript and be performance minded: We wanted a solution that would make the most of Web Workers, doing most of the logic in a separate thread, and only using the main thread when unavoidable or else carries to much overhead.

## What about Web Components?

Web Components are great, especially in how they use the shadow DOM. However, they rely on a collection of technologies which requires templates be downloaded, along with the JavaScript functions that will use them to create custom components that get used on the page.

They have the same issue as not being server side rendered, as well as requiring that extra markup be sent down the line in the form of unrendered templates, which increases page weight.

## Hypothesis

If static website content is written using only valid, semantic HTML markup, then a library can derive a template/markup structure and data model from it, which is easy to work with to dynamically update the content, because the static markup contains all the information necessary to serve as template and model.