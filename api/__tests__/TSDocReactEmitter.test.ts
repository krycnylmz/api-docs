import * as React from "react"
import * as renderer from "react-test-renderer"
import { TSDocParser } from "@microsoft/tsdoc"
import { renderTSDoc } from "../TSDocReactEmitter"

function createTestComponent(doc: string): renderer.ReactTestRenderer {
    const parser = new TSDocParser()
    const parsed = parser.parseString(doc)
    const element = renderTSDoc(parsed.docComment, React)
    if (!React.isValidElement(element)) throw new Error("renderTSDoc did not return an element")
    return renderer.create(element)
}

function createParamComponent(param: string): renderer.ReactTestRenderer {
    const parser = new TSDocParser()
    const parsed = parser.parseString(param)
    const element = renderTSDoc(parsed.docComment.params.getChildNodes()[0], React)
    if (!React.isValidElement(element)) throw new Error("renderTSDoc did not return an element")
    return renderer.create(element)
}

describe("TSDocReactEmitter", () => {
    test("renders a basic string", () => {
        const component = createTestComponent(`
        /**
         * Hello World
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders several paragraphs", () => {
        const component = createTestComponent(`
        /**
         * First Paragraph
         *
         * Second Paragraph
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders a list of items using hyphens", () => {
        const component = createTestComponent(`
        /**
         * Preceding Text
         *
         * - This is item one
         * - This is item two with \`code\`
         * - This is item three with a {@link http://example.com}
         * - This is item four with a <b>Bold Tag</b>
         *
         * Trailing Text
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("supports a list item ending in code", () => {
        const component = createTestComponent(`
        /**
         * - This is an item with \`code\`
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders a list of items using asterisks", () => {
        const component = createTestComponent(`
        /**
         * Preceding Text
         *
         * * This is item one
         * * This is item two with \`code\`
         * * This is item three with a {@link http://example.com}
         * * This is item four with a <b>Bold Tag</b>
         *
         * Trailing Text
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders a code block", () => {
        const component = createTestComponent(`
        /**
         * Hello World
         *
         * @remarks
         * \`\`\`jsx
         * const foo = "bar";
         * \`\`\`
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders inline code blocks", () => {
        const component = createTestComponent(`
        /**
         * Hello World this is some \`code\`.
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders @link tags", () => {
        const component = createTestComponent(`
        /**
         * Hello World this is a website: {@link http://example.com}.
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders @link tags with text", () => {
        const component = createTestComponent(`
        /**
         * Hello World this is an {@link http://example.com | example}.
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders @link tags with references", () => {
        const component = createTestComponent(`
        /**
         * Hello World this is a reference {@link MyComponent.hello}.
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("renders @link tags with references and text", () => {
        const component = createTestComponent(`
        /**
         * Hello World this is a reference {@link MyComponent.hello | hello}.
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })

    test("supports @params with lists", () => {
        const component = createParamComponent(`
        /**
         * @param options -
         * - Clamp values to within the given range. Defaults to \`true\`
         */`)
        expect(component.toJSON()).toMatchSnapshot()
    })
})
