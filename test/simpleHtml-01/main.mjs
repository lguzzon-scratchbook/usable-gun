// @ts-check

import { gunEnv } from "../../usableLib/util/gunAdapter.js"

const gunEnvironment = await gunEnv()

const GunOptions = {
	file: 'usable-gun--Storage-simpleHtml-01',
	localStorage: true,
	// ,peers: ['https://gundb.h3r3t0.win/gun']
}

const gun = new gunEnvironment.Gun({
	...GunOptions,
})

const data = gun.get("parentRoot").get("childRoot").get("data")

// Listen for real-time change events.
data.get("message").on((message) => {
	console.log("Message:", message)
})


// Writes a value to the key 'data'.
data.put({ message: `**> Hello world! ${new Date().toLocaleString()}` })

// Periodically update the 'data' node with a timestamped message
const updateInterval = 2000 // milliseconds
setInterval(() => {
	const timestamp = new Date().toLocaleString()
	console.log("Updating message:", timestamp)
	// gun.pathPut(path, { message: `Hello world! ${timestamp}` })
	data.put({ message: `--> Hello world! ${timestamp}` })
}, updateInterval)
