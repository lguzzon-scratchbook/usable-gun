import { gunSpace } from "../../usableLib/util/gunAdapter.js"

// Get a reference to the 'data' node in the graph
const path = 'data'
const gun = await gunSpace({
	gunOptions: {
		file: `usable-gun--Storage--${path}`,
		localStorage: false
	}
})

// Periodically update the 'data' node with a timestamped message
const updateInterval = 2000 // milliseconds
setInterval(() => {
	const timestamp = new Date().toLocaleString()
	console.log("Updating message:", timestamp)
	// gun.pathPut(path, { message: `Hello world! ${timestamp}` })
	gun.pathPut(`${path}.message`, `Hello world! ${timestamp}`)
}, updateInterval)

// Subscribe to real-time updates on the 'message' field within the 'data' node
gun.pathOn(path, ({ message }) => {
// Log the updated message to the console
	console.log("Message --> :", message)
})

gun.pathOn(`${path}.message`, (data) => {
	// Log the updated message to the console
	console.log("Message **> :", data)
})
