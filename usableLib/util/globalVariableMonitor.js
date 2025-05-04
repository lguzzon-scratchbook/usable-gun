/**
 * Creates a monitor to track newly created and deleted global variables.
 *
 * LIMITATIONS:
 * - Cannot reliably track simple access/reads of *pre-existing* globals.
 * - Doesn't detect variables created AND deleted within the monitoring period.
 * - Monitors only direct properties of the global object.
 *
 * @returns {{start: Function, stop: Function}} An object with start and stop methods.
 */
export function createGlobalVariableMonitor(){
	let initialGlobalKeys = null;
	let isMonitoring = false;

	// Get the global object reliably (works in browser, Node, Web Workers)
	const _global = typeof globalThis !== "undefined"
		? globalThis :
		typeof window !== "undefined"
			? window :
			typeof global !== "undefined"
				? global :
				typeof self !== "undefined" ? self : this; // Fallback

	// Helper to get current global keys as a Set for efficient lookup
	const getCurrentGlobalKeys = () => {
		try {
			// Object.keys gets enumerable properties, usually sufficient for pollution tracking.
			// Use Object.getOwnPropertyNames(global) for non-enumerable ones if needed,
			// but beware it includes many built-ins.
			return new Set(Object.keys(_global));
		} catch (e) {
			console.error("Error accessing global scope properties:", e);
			return new Set(); // Return empty set on error
		}
	};

	/**
	 * Starts monitoring the global scope.
	 * Records the current set of global variable keys.
	 */
	function start(){
		if (isMonitoring) {
			console.warn("Global variable monitoring is already active.");
			return;
		}
		console.log("Starting global variable monitoring...");
		initialGlobalKeys = getCurrentGlobalKeys();
		isMonitoring = true;
		console.log(`Initial global key count: ${initialGlobalKeys.size}`);
	}

	/**
	 * Stops monitoring and reports the differences.
	 * @returns {{created: Array<{name: string, value: any}>, deleted: Array<string>, accessed: Array, message: string}|null}
	 *          An object containing arrays of created variable info (name/value),
	 *          deleted variable names, an empty array for 'accessed' (due to limitations),
	 *          and a summary message. Returns null if monitoring wasn't started.
	 */
	function stop(){
		if (!isMonitoring) {
			console.warn("Global variable monitoring was not started.");
			return {
				created: [],
				deleted: [],
				accessed: [], // Explicitly stating limitation
				message: "Monitoring was not active.",
			};
		}

		console.log("Stopping global variable monitoring...");
		const finalGlobalKeys = getCurrentGlobalKeys();
		isMonitoring = false; // Stop monitoring before processing results

		const createdVariables = [];
		const deletedKeys = [];

		// Find newly created variables (in final keys but not initial keys)
		finalGlobalKeys.forEach(key => {
			if (!initialGlobalKeys.has(key)) {
				try {
					// Store the name and current value
					createdVariables.push({
						name: key,
						value: _global[key],
					});
				} catch (e) {
					// Handle potential errors accessing the property (e.g., security restrictions)
					createdVariables.push({
						name: key,
						value: `[Error accessing value: ${e.message}]`,
					});
				}
			}
		});

		// Find deleted keys (in initial keys but not final keys)
		initialGlobalKeys.forEach(key => {
			if (!finalGlobalKeys.has(key)) {
				deletedKeys.push(key);
			}
		});

		// --- Acknowledgment of Limitation ---
		console.warn(
			"Limitation: Reliably tracking 'access' (read/usage) of *pre-existing* global variables " +
        "is not feasible with this plain JavaScript approach. The 'accessed' list will be empty. " +
        "This report focuses on *newly created* and *deleted* global keys.",
		);
		// --- End Acknowledgment ---


		const initialCount = initialGlobalKeys.size; // Store before resetting
		// Reset state for potential reuse
		initialGlobalKeys = null;

		const report = {
			created: createdVariables,
			deleted: deletedKeys,
			accessed: [], // Cannot track access reliably
			message: `Monitoring complete. Initial keys: ${initialCount}, Final keys: ${finalGlobalKeys.size}. Found ${createdVariables.length} new global variable(s) and ${deletedKeys.length} deleted global key(s).`,
		};

		console.log(report.message);
		if (report.created.length > 0) {
			console.log("Newly created globals:", report.created);
		}
		if (report.deleted.length > 0) {
			console.log("Deleted global keys:", report.deleted);
		}


		return report;
	}

	// Expose the public methods
	return {
		start,
		stop
	};
}

// // --- Example Usage ---

// // 1. Create a monitor instance
// const monitor = createGlobalVariableMonitor();

// // 2. Start monitoring before the code you want to inspect
// console.log("--- Starting Monitoring ---");
// monitor.start();

// // 3. Run the code that might pollute the global scope
// console.log("Running potentially polluting code...");
// var globalVar1 = "I am explicitly global (using var outside function)"; // Pollutes
// let globalLet = "I am global too in script scope"; // Pollutes in script scope
// globalVar2 = "Implicit global"; // Pollutes (BAD PRACTICE!)
// window.globalVar3 = { type: "object" }; // Pollutes explicitly on window

// function testScope() {
//   // These are local to the function, won't be detected as global pollution
//   let localVar = "I am local";
//   const localConst = "Also local";
//   console.log(localVar, localConst);

//   // Modifying an existing global (won't be listed as 'created')
//   if (typeof existingGlobal !== 'undefined') {
//       existingGlobal = "Modified!";
//   } else {
//       // If it didn't exist, *this* would create it globally if run outside strict mode
//       // existingGlobal = "Created implicitly inside function";
//   }
// }

// // Define one *before* starting monitor to see it's not reported as new
// var existingGlobal = "Initial Value";

// testScope();

// // Delete one of the globals created during monitoring
// // Note: 'delete' only works on properties explicitly set on an object (like window)
// // or implicit globals. It doesn't work reliably on 'var' or 'let'/'const' at global scope.
// try {
//     delete globalVar2; // This usually works for implicit globals
//     delete window.globalVar3; // This works
//     // delete globalVar1; // This often fails or returns false in strict mode/modules
// } catch(e) { console.error("Delete error:", e); }


// // 4. Stop monitoring and get the report
// console.log("--- Stopping Monitoring ---");
// const report = monitor.stop();

// // 5. Analyze the report (already logged by the stop function, but you can use the object)
// if (report && report.created.length > 0) {
//   console.log("\nDetailed Report - Created Variables:");
//   report.created.forEach(item => {
//     console.log(` - Name: ${item.name}, Type: ${typeof item.value}, Value:`, item.value);
//   });
// }
// if (report && report.deleted.length > 0) {
//   console.log("\nDetailed Report - Deleted Keys:");
//   report.deleted.forEach(key => {
//     console.log(` - Name: ${key}`);
//   });
// }
