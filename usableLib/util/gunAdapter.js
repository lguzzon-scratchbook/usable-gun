// @ts-check

import {
	GunEnvironment,
	defaultBrowserPlugin,
	defaultSeaPlugin,
} from "../../index.js"
import radixPlugin from "../../lib/radix.js"
import { getRefFromPath } from "./gunUtil.js";

/**
	* Initializes and returns a Gun application environment.
	* @param {Object} [options]
	* @param {Object} [options.gunEnvironmentOptions]
	* @param {Object} [options.gunOptions]
	* @param {string} [options.appRoot]
	* @returns {Promise<{
	*   gunEnvironment: any,
	*   gun: any,
	*   sea: any,
	*   Gun: any,
	*   appRoot: string,
	*   ref: any,
	*   pathRef: (path: string) => any,
	*   pathValue: (path: string) => Promise<any>,
	*   pathPut: (path: string, value: any) => any,
	*   pathOn: (path: string, cb: (data: any) => void) => any
	* }>}
	*/
async function gunApp({
	gunEnvironmentOptions = {
		environmentHint: "browser",
		iContributeToGun: true,
	},
	gunOptions = {
		// file: "usable-gun--Storage",
		localStorage: false,
		// peers: ['https://gundb.h3r3t0.win/gun']
	},
	appRoot = "appRoot",
} = {}) {
	const gunEnvironment = new GunEnvironment(gunEnvironmentOptions);

	await gunEnvironment.usePlugins([
		defaultBrowserPlugin,
		defaultSeaPlugin,
		radixPlugin,
	])

	const { Gun, SEA } = gunEnvironment.library
	const gun = new Gun(gunOptions)
	const ref = gun.get(appRoot)

	const pathRef = (path) => getRefFromPath(path, ref)
	const pathValue = async (path) => new Promise((resolve) => pathRef(path).once((data) => resolve(data)))
	const pathPut = (path, value) => pathRef(path).put(value)
	const pathOn = (path, cb) => {
		return pathRef(path).on((data) => cb(data))
	};

	return {
		gunEnvironment,
		gun,
		sea: SEA,
		Gun,
		appRoot,
		ref,
		pathRef,
		pathValue,
		pathPut,
		pathOn,
	}
}

export { gunApp }
