import { gunApp } from "../../usableLib/util/gunAdapter.js"

let counter = -1;

// Get a reference to the 'data' node in the graph
const path = 'data'
const gun = await gunApp({
	gunOptions: {
		// file: `usable-gun--Storage--${path}`,
	}
})

// Periodically update the 'data' node with a timestamped message
const updateInterval = 1000 // milliseconds
console.log("Starting putInterval")
const puIntervalID = setInterval(() => {
	counter++
	const timestamp = new Date().toLocaleString()
	const message = `${counter} - Hello world! ${timestamp}`
	console.log("Updating message:", message)
	// gun.pathPut(path, { message: `Hello world! ${timestamp}` })
	gun.pathPut(`${path}.message`, message)
}, updateInterval)

const stopTimeoutID = setTimeout(() => {
	clearInterval(puIntervalID)
	clearTimeout(stopTimeoutID)
	console.log("Stopping putInterval")
}, updateInterval * 10)

const stopPathOnObjectTimeoutID = setTimeout(() => {
	gun.pathOff(path)
	clearTimeout(stopPathOnObjectTimeoutID)
	console.log("Stopping Object pathOn")
}, updateInterval * 5.5)

const stopPathOnPropertyTimeoutID = setTimeout(() => {
	gun.pathOff(path)
	clearTimeout(stopPathOnPropertyTimeoutID)
	console.log("Stopping Property pathOn")
}, updateInterval * 7.5)

// Subscribe to real-time updates on the 'message' field within the 'data' node
gun.pathOn(path, ({ message }) => {
// Log the updated message to the console
	console.log("Object Message:", message)
})

gun.pathOn(`${path}.message`, (data) => {
	// Log the updated message to the console
	console.log("Property Message:", data)
})
