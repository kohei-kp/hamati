import { Router } from 'itty-router'

// Create a new router
const router = Router()

/*
Our index route, a simple hello world.
*/
router.get('/', () => {
    return new Response(
        'Hello, world! This is the root page of your Worker template.'
    )
})

/**
 * umislot
 */
router.post('/umislot', () => {
    const rand = () => {
        return Math.floor(Math.random() * 4)
    }

    const veries = [':very:', ':very-left:', ':very-right:', ':very-bottom:']
    const longs = [':long:', ':long-left:', ':long-right:', ':long-bottom:']
    const umityans = [
        ':umityan:',
        ':umityan-left:',
        ':umityan-right:',
        ':umityan-bottom:',
    ]

    const textLines = [veries[rand()], longs[rand()], umityans[rand()]]
    const blocks = [
        {
            type: 'section',
            text: {
                type: 'plain_text',
                text: textLines.join('\n'),
            },
        },
    ]

    return new Response(
        JSON.stringify({
            blocks,
            response_type: 'in_channel',
        }),
        { headers: { 'Content-type': 'application/json' } }
    )
})

/**
 * slot
 */
router.post('/slot', () => {
    const rand = () => {
        return Math.floor(Math.random() * 4)
    }

    const items = [':7:', ':cherries:', ':watermelon:', ':bell:']
    const text = items[rand()] + items[rand()] + items[rand()]

    const blocks = [
        {
            type: 'section',
            text: {
                type: 'plain_text',
                text,
            },
        },
    ]

    return new Response(
        JSON.stringify({
            blocks,
            response_type: 'in_channel',
        }),
        { headers: { 'Content-type': 'application/json' } }
    )
})

/*
This route demonstrates path parameters, allowing you to extract fragments from the request
URL.

Try visit /example/hello and see the response.
*/
router.get('/example/:text', ({ params }) => {
    // Decode text like "Hello%20world" into "Hello world"
    let input = decodeURIComponent(params.text)

    // Construct a buffer from our input
    let buffer = Buffer.from(input, 'utf8')

    // Serialise the buffer into a base64 string
    let base64 = buffer.toString('base64')

    // Return the HTML with the string to the client
    return new Response(`<p>Base64 encoding: <code>${base64}</code></p>`, {
        headers: {
            'Content-Type': 'text/html',
        },
    })
})

/*
This shows a different HTTP method, a POST.

Try send a POST request using curl or another tool.

Try the below curl command to send JSON:

$ curl -X POST <worker> -H "Content-Type: application/json" -d '{"abc": "def"}'
*/
router.post('/post', async request => {
    // Create a base object with some fields.
    let fields = {
        asn: request.cf.asn,
        colo: request.cf.colo,
    }

    // If the POST data is JSON then attach it to our response.
    if (request.headers.get('Content-Type') === 'application/json') {
        fields['json'] = await request.json()
    }

    // Serialise the JSON to a string.
    const returnData = JSON.stringify(fields, null, 2)

    return new Response(returnData, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
})

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).

Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all('*', () => new Response('404, not found!', { status: 404 }))

/*
This snippet ties our worker to the router we deifned above, all incoming requests
are passed to the router where your routes are called and the response is sent.
*/
addEventListener('fetch', e => {
    e.respondWith(router.handle(e.request))
})
