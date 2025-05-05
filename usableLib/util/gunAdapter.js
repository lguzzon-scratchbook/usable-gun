// @ts-check

import {
	GunEnvironment,
	defaultBrowserPlugin,
	defaultSeaPlugin,
} from "../../index.js"
import radixPlugin from "../../lib/radix.js"
import { getRefFromPath } from "./gunUtil.js"

const cGunEnvironmentOptions = {
	environmentHint: "browser",
	iContributeToGun: true,
}

const cGunPlugins = [defaultBrowserPlugin, defaultSeaPlugin, radixPlugin,]

async function gunEnv({
	gunEnvironmentOptions = cGunEnvironmentOptions,
	gunPlugins = cGunPlugins,
} = {}) {
	const gunEnvironment = new GunEnvironment(gunEnvironmentOptions)
	await gunEnvironment.usePlugins(gunPlugins)
	const { Gun, SEA } = gunEnvironment.library
	return {
		gunEnvironment,
		Gun,
		SEA,
	}
}

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
	*   gunApp:string,
	*   ref: any,
	*   pathRef: (path: string) => any,
	*   pathValue: (path: string) => Promise<any>,
	*   pathPut: (path: string, value: any) => any,
	*   pathOn: (path: string, cb: (data: any) => void) => any
	* }>}
	*/
async function gunSpace({
	gunEnvironmentOptions = cGunEnvironmentOptions,
	gunPlugins = cGunPlugins,
	gunOptions = {
		// file: "usable-gun--Storage",
		localStorage: false,
		// peers: ['https://gundb.h3r3t0.win/gun']
	},
	gunApp = "appRoot",
} = {}) {
	const gunEnvironment = await gunEnv({gunEnvironmentOptions, gunPlugins})
	const gun = new gunEnvironment.Gun(gunOptions)
	const ref = gun.get(gunApp)

	const pathRef = (path) => getRefFromPath(path, ref)
	const pathValue = async (path) => new Promise((resolve) => pathRef(path).once((data) => resolve(data)))
	const pathPut = (path, value) => pathRef(path).put(value)
	const pathOn = (path, cb) => pathRef(path).on((data) => cb(data))
	const pathOff = (path) => pathRef(path).off()

	return {
		gunEnvironment,
		gun,
		gunApp,
		ref,
		pathRef,
		pathValue,
		pathPut,
		pathOn,
		pathOff
	}
}

export { gunEnv , gunSpace }
