import defaultAxePlugin from "./axe.js";
import defaultGunPlugin from "./gun.js";
import defaultSeaPlugin from "./sea.js";
import basicSeaPlugin from "./sea/index.js";
import basicGunPlugin from "./src/index.js";
import { GunEnvironment } from "./usableLib/GunEnvironment.js";
import {
	ConsoleDebugger,
	NoDebugger,
	StoreDebugger,
} from "./usableLib/debuggers.js";

const defaultBrowserPlugin = defaultGunPlugin;

export {
	GunEnvironment,
	basicGunPlugin,
	basicSeaPlugin,
	defaultGunPlugin,
	defaultSeaPlugin,
	defaultAxePlugin,
	defaultBrowserPlugin,
	NoDebugger,
	ConsoleDebugger,
	StoreDebugger,
};
