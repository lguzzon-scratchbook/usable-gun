/* global Gun */
// Import necessary modules and plugins
import { GunEnvironment } from "../../index.js";
import { defaultBrowserPlugin, defaultSeaPlugin } from "../../index.js"; // Simulates browser environment imports
import radixPlugin from "../../lib/radix.js";

// --- Configuration ---

// Initialize the Gun environment
const gunEnvironment = new GunEnvironment({
	environmentHint: "browser",
	iContributeToGun: true, // Optional: Indicate contribution status
});

// Define Gun options (e.g., storage, peers)
const gunOptions = {
	file: "usable-gun--Storage", // Use Radisk adapter for storage
	// peers: ['https://example.com/gun'] // Uncomment to add peers
};

// --- Initialization ---

// Asynchronously load required Gun plugins
await gunEnvironment.usePlugins([
	defaultBrowserPlugin,
	defaultSeaPlugin,
	radixPlugin,
]);

// Get Gun constructor and SEA module from the environment
const { Gun: GunConstructor, SEA } = gunEnvironment.library;

// Create a new Gun instance with the specified options
const gun = new GunConstructor({
	...gunOptions,
});

// --- Application Logic ---

// Self-executing function to encapsulate the main logic
(() => {
	// Get a reference to the 'data' node in the graph
	const dataNode = gun.get("data");

	// Periodically update the 'data' node with a timestamped message
	const updateInterval = 2000; // milliseconds
	setInterval(() => {
		const timestamp = new Date().toLocaleString();
		dataNode.put({ message: `Hello world! ${timestamp}` });
	}, updateInterval);

	// Subscribe to real-time updates on the 'message' field within the 'data' node
	dataNode.get("message").on((message) => {
		// Log the updated message to the console
		console.log("Message:", message);
	});
})();
