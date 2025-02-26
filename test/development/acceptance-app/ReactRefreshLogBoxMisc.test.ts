import { createSandbox } from 'development-sandbox'
import { FileRef, nextTestSetup } from 'e2e-utils'
import path from 'path'
import { outdent } from 'outdent'

describe('ReactRefreshLogBox app', () => {
  const { isTurbopack, next } = nextTestSetup({
    files: new FileRef(path.join(__dirname, 'fixtures', 'default-template')),
    skipStart: true,
  })

  test('<Link legacyBehavior> with multiple children', async () => {
    await using sandbox = await createSandbox(next)
    const { browser, session } = sandbox

    await session.patch(
      'index.js',
      outdent`
        import Link from 'next/link'

        export default function Index() {
          return (
            <Link href="/" legacyBehavior>
              <p>One</p>
              <p>Two</p>
            </Link>
          )
        }
      `
    )

    if (isTurbopack) {
      await expect(browser).toDisplayRedbox(`
       {
         "count": 1,
         "description": "Error: Multiple children were passed to <Link> with \`href\` of \`/\` but only one child is supported https://nextjs.org/docs/messages/link-multiple-children 
       Open your browser's console to view the Component stack trace.",
         "environmentLabel": null,
         "label": "Unhandled Runtime Error",
         "source": "index.js (5:5) @ Index
       > 5 |     <Link href="/" legacyBehavior>
           |     ^",
         "stack": [
           "Index index.js (5:5)",
           "<FIXME-file-protocol>",
         ],
       }
      `)
    } else {
      await expect(browser).toDisplayRedbox(`
       {
         "count": 1,
         "description": "Error: Multiple children were passed to <Link> with \`href\` of \`/\` but only one child is supported https://nextjs.org/docs/messages/link-multiple-children 
       Open your browser's console to view the Component stack trace.",
         "environmentLabel": null,
         "label": "Unhandled Runtime Error",
         "source": "index.js (5:5) @ Index
       > 5 |     <Link href="/" legacyBehavior>
           |     ^",
         "stack": [
           "Index index.js (5:5)",
           "Page app/page.js (4:10)",
         ],
       }
      `)
    }
    expect(
      await session.evaluate(
        () =>
          (
            document
              .querySelector('body > nextjs-portal')
              .shadowRoot.querySelector(
                '#nextjs__container_errors_desc a:nth-of-type(1)'
              ) as any
          ).href
      )
    ).toMatch('https://nextjs.org/docs/messages/link-multiple-children')
  })

  test('<Link> component props errors', async () => {
    await using sandbox = await createSandbox(next)
    const { browser, session } = sandbox

    await session.patch(
      'index.js',
      outdent`
        import Link from 'next/link'

        export default function Hello() {
          return <Link />
        }
      `
    )

    if (isTurbopack) {
      await expect(browser).toDisplayRedbox(`
       {
         "count": 1,
         "description": "Error: Failed prop type: The prop \`href\` expects a \`string\` or \`object\` in \`<Link>\`, but got \`undefined\` instead.
       Open your browser's console to view the Component stack trace.",
         "environmentLabel": null,
         "label": "Unhandled Runtime Error",
         "source": "index.js (4:10) @ Hello
       > 4 |   return <Link />
           |          ^",
         "stack": [
           "Array.forEach <anonymous> (0:0)",
           "Hello index.js (4:10)",
           "<FIXME-file-protocol>",
         ],
       }
      `)
    } else {
      await expect(browser).toDisplayRedbox(`
       {
         "count": 1,
         "description": "Error: Failed prop type: The prop \`href\` expects a \`string\` or \`object\` in \`<Link>\`, but got \`undefined\` instead.
       Open your browser's console to view the Component stack trace.",
         "environmentLabel": null,
         "label": "Unhandled Runtime Error",
         "source": "index.js (4:10) @ Hello
       > 4 |   return <Link />
           |          ^",
         "stack": [
           "Array.forEach <anonymous> (0:0)",
           "Hello index.js (4:10)",
           "Page app/page.js (4:10)",
         ],
       }
      `)
    }

    await session.patch(
      'index.js',
      outdent`
        import Link from 'next/link'

        export default function Hello() {
          return <Link href="/">Abc</Link>
        }
      `
    )
    await session.assertNoRedbox()

    await session.patch(
      'index.js',
      outdent`
        import Link from 'next/link'

        export default function Hello() {
          return (
            <Link
              href="/"
              as="/"
              replace={false}
              scroll={false}
              shallow={false}
              passHref={false}
              prefetch={false}
            >
              Abc
            </Link>
          )
        }
      `
    )
    await session.assertNoRedbox()

    await session.patch(
      'index.js',
      outdent`
        import Link from 'next/link'

        export default function Hello() {
          return (
            <Link
              href="/"
              as="/"
              replace={true}
              scroll={true}
              shallow={true}
              passHref={true}
              prefetch={true}
            >
              Abc
            </Link>
          )
        }
      `
    )
    await session.assertNoRedbox()

    await session.patch(
      'index.js',
      outdent`
        import Link from 'next/link'

        export default function Hello() {
          return (
            <Link
              href="/"
              as="/"
              replace={undefined}
              scroll={undefined}
              shallow={undefined}
              passHref={undefined}
              prefetch={undefined}
            >
              Abc
            </Link>
          )
        }
      `
    )
    await session.assertNoRedbox()

    await session.patch(
      'index.js',
      outdent`
        import Link from 'next/link'

        export default function Hello() {
          return (
            <Link
              href="/"
              as="/"
              replace={undefined}
              scroll={'oops'}
              shallow={undefined}
              passHref={undefined}
              prefetch={undefined}
            >
              Abc
            </Link>
          )
        }
      `
    )
    if (isTurbopack) {
      await expect(browser).toDisplayRedbox(`
       {
         "count": 1,
         "description": "Error: Failed prop type: The prop \`scroll\` expects a \`boolean\` in \`<Link>\`, but got \`string\` instead.
       Open your browser's console to view the Component stack trace.",
         "environmentLabel": null,
         "label": "Unhandled Runtime Error",
         "source": "index.js (5:5) @ Hello
       > 5 |     <Link
           |     ^",
         "stack": [
           "Array.forEach <anonymous> (0:0)",
           "Hello index.js (5:5)",
           "<FIXME-file-protocol>",
         ],
       }
      `)
    } else {
      await expect(browser).toDisplayRedbox(`
       {
         "count": 1,
         "description": "Error: Failed prop type: The prop \`scroll\` expects a \`boolean\` in \`<Link>\`, but got \`string\` instead.
       Open your browser's console to view the Component stack trace.",
         "environmentLabel": null,
         "label": "Unhandled Runtime Error",
         "source": "index.js (5:5) @ Hello
       > 5 |     <Link
           |     ^",
         "stack": [
           "Array.forEach <anonymous> (0:0)",
           "Hello index.js (5:5)",
           "Page app/page.js (4:10)",
         ],
       }
      `)
    }

    await session.patch(
      'index.js',
      outdent`
        import Link from 'next/link'

        export default function Hello() {
          return (
            <Link
              href={false}
              as="/"
              replace={undefined}
              scroll={'oops'}
              shallow={undefined}
              passHref={undefined}
              prefetch={undefined}
            >
              Abc
            </Link>
          )
        }
      `
    )
    await expect(browser).toDisplayRedbox(`
     {
       "count": 1,
       "description": "Error: Failed prop type: The prop \`href\` expects a \`string\` or \`object\` in \`<Link>\`, but got \`boolean\` instead.
     Open your browser's console to view the Component stack trace.",
       "environmentLabel": null,
       "label": "Unhandled Runtime Error",
       "source": "index.js (5:5) @ Hello
     > 5 |     <Link
         |     ^",
       "stack": [
         "Array.forEach <anonymous> (0:0)",
         "Hello index.js (5:5)",
         "Page app/page.js (4:10)",
       ],
     }
    `)
  })

  test('server-side only compilation errors', async () => {
    await using sandbox = await createSandbox(next)
    const { browser, session } = sandbox

    await session.patch(
      'app/page.js',
      outdent`
        'use client'
        import myLibrary from 'my-non-existent-library'
        export async function getStaticProps() {
          return {
            props: {
              result: myLibrary()
            }
          }
        }
        export default function Hello(props) {
          return <h1>{props.result}</h1>
        }
      `
    )

    if (isTurbopack) {
      await expect(browser).toDisplayRedbox(`
       {
         "count": 1,
         "description": "Ecmascript file had an error",
         "environmentLabel": null,
         "label": "Build Error",
         "source": "./app/page.js (3:23)
       Ecmascript file had an error
       > 3 | export async function getStaticProps() {
           |                       ^^^^^^^^^^^^^^",
         "stack": [],
       }
      `)
    } else {
      await expect(browser).toDisplayRedbox(`
       {
         "count": 1,
         "description": "Error:   x "getStaticProps" is not supported in app/. Read more: https://nextjs.org/docs/app/building-your-application/data-fetching",
         "environmentLabel": null,
         "label": "Build Error",
         "source": "./app/page.js
       Error:   x "getStaticProps" is not supported in app/. Read more: https://nextjs.org/docs/app/building-your-application/data-fetching
         |
         |
          ,-[3:1]
        1 | 'use client'
        2 | import myLibrary from 'my-non-existent-library'
        3 | export async function getStaticProps() {
          :                       ^^^^^^^^^^^^^^
        4 |   return {
        5 |     props: {
        6 |       result: myLibrary()
          \`----
       Import trace for requested module:
       ./app/page.js",
         "stack": [],
       }
      `)
    }
  })
})
