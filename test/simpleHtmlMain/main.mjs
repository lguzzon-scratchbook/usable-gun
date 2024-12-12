/* global Gun */
import { GunEnvironment } from "../../../index.js";
import { defaultBrowserPlugin, defaultSeaPlugin } from "../../../index.js"; // Equivalent to importing "gun" in a browser
import radixPlugin from "../../../lib/radix.js";

const gunEnvironment = new GunEnvironment({
	environmentHint: "browser",
	iContributeToGun: true,
});

await gunEnvironment.usePlugins([
	defaultBrowserPlugin,
	defaultSeaPlugin,
	radixPlugin,
]);

const GunOptions = {
	file: "usable-gun--Storage",
	// ,peers: ['https://gundb.h3r3t0.win/gun']
};

const gun = new gunEnvironment.library.Gun({
	...GunOptions,
});
const sea = gunEnvironment.library.SEA;
const Gun = gunEnvironment.library.Gun;
(() => {
	// Reads key 'data'.
	const data = gun.get("data");
	// Writes a value to the key 'data'.
	data.put({ message: `Hello world! ${new Date().toLocaleString()}` });
	// Listen for real-time change events.
	data.get("message").on((message) => {
		console.log("Message:", message);
	});
})();
