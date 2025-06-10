import { getPackageInfo } from '@zos/app';
import { getSystemInfo } from '@zos/settings';
import { readJSON, writeJSON } from './fs';
import { device_table } from "./device_table";

export function getDeviceInfoPlus() {
	const cache = 'device_info.json';

	const { hwVersion, minAPI } = getSystemInfo();

	const cache_info = readJSON(cache);
	if (cache_info && cache_info.name && cache_info.hwVersion === hwVersion) {
		return cache_info;
	}

	const { appPath } = getPackageInfo();
	const fp = `../../${appPath}/app.json`;

	const json = readJSON(fp);
	let device_sources = [];
	if (json && json.platforms) {
		for (let i = 0; i < json.platforms.length; i++) {
			device_sources.push(json.platforms[i].deviceSource);
		}
	}

	let match = null;
	let maybe = [];
	const parsed_api = parseFloat(minAPI);

	for (const name in device_table) {
		const info = device_table[name];
		for (let i = 0; i < info.ds.length; i++) {
			if (device_sources.indexOf(info.ds[i]) !== -1) {
				maybe.push({ name: name, info: info });
				break;
			}
		}
	}

	if (maybe.length === 1) {
		match = maybe[0];
	} else if (maybe.length > 1) {
		for (let i = 0; i < maybe.length; i++) {
			// ? improve this as now it relies on exact api instead of >=
			if (maybe[i].info.api === parsed_api) {
				match = maybe[i];
				break;
			}
		}
		if (!match) {
			match = maybe[0];
		}
	}

	let result;
	if (match) {
		result = {
			name: match.name,
			zos: match.info.zos,
			api: match.info.api,
			device_sources: match.info.ds,
			shape: match.info.shape,
			width: match.info.W,
			height: match.info.H,
			buttons: match.info.btn,
			widget_support: Boolean(match.info.WS),
			hw_version: hwVersion
		};
		writeJSON(cache, result);
	} else {
		// fallback values
		result = {
				name: 'Unknown Device',
				zos: parseFloat(minAPI) ?? 1.0,
				api: parseFloat(minAPI) ?? 1.0,
				device_sources: [ 404 ],
				shape: 'U',  // unknown
				width: 480,  
				height: 480, 
				buttons: 1,
				widget_support: false,
				hw_version: hwVersion
		};
}

	return result;
}