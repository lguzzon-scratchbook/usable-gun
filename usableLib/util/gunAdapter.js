// @ts-check

import {
	GunEnvironment,
	defaultBrowserPlugin,
	defaultSeaPlugin,
} from "../../index.js"
import radixPlugin from "../../lib/radix.js"
import radiskPlugin from "../../lib/radisk.js"
import storePlugin from "../../lib/store.js"
import rmemPlugin from "../../lib/rmem.js"
import { getRefFromPath } from "./gunUtil.js";

const cGunEnvironmentOptions = {
	environmentHint: "browser",
	iContributeToGun: true,
};

const cGunPlugins = [defaultBrowserPlugin, defaultSeaPlugin]
const cGunStorePlugins = [radixPlugin, radiskPlugin, storePlugin, rmemPlugin];

async function gunEnv({
	gunEnvironmentOptions = cGunEnvironmentOptions,
	gunEnvironmentPlugins = cGunPlugins,
} = {}) {
	const gunEnvironment = new GunEnvironment(gunEnvironmentOptions)
	await gunEnvironment.usePlugins(gunEnvironmentPlugins)
	const { Gun, SEA } = gunEnvironment.library;
	return {
		Env: gunEnvironment,
		Gun,
		SEA,
	}
}
async function gunApp({
	gunEnvironmentOptions = cGunEnvironmentOptions,
	gunPlugins = cGunPlugins,
	gunStorePlugins = cGunStorePlugins,
	gunOptions = {
		file: "gunApp--Storage",
		localStorage: false,
		// peers: ['https://gundb.h3r3t0.win/gun']
	},
	gunApp = "appRoot",
} = {}) {
	const usingLocalStorage = gunOptions?.localStorage || false
	const gunEnvironmentPlugins = gunPlugins.concat(
		usingLocalStorage ? [] : gunStorePlugins,
	)
	const gunEnvironment = await gunEnv({
		gunEnvironmentOptions,
		gunEnvironmentPlugins,
	})
	const gunOptionsFinal = {
		...gunOptions,
	}
	if (!usingLocalStorage) {
		gunOptionsFinal.localStorage = false
		gunOptionsFinal.store = gunEnvironment.Env.library.Rmem()
	}
	gunOptionsFinal.file = gunOptions.file || `gunApp--Storage--${gunApp}`
	const gun = new gunEnvironment.Gun(gunOptionsFinal)
	const ref = gun.get(gunApp);

	const pathRef = (path) => getRefFromPath(path, ref)
	const pathValue = async (path) =>
		new Promise((resolve) => pathRef(path).once((data) => resolve(data)))
	const pathPut = (path, value) => pathRef(path).put(value)
	const pathOn = (path, cb) => {
		const cRef = pathRef(path)
		return cRef.on((data) => cb(data))
	}
	const pathOff = (path) => pathRef(path).off();

	return {
		gunEnvironment,
		gun,
		gunApp,
		ref,
		pathRef,
		pathValue,
		pathPut,
		pathOn,
		pathOff,
	}
}

export { gunEnv, gunApp }
