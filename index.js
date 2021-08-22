//https://bbs.nga.cn/read.php?tid=28133946&rand=509
// library from cdn
const ExcelJSUrl = "https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.2.0/exceljs.min.js";
const FileSaverUrl = "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js";
const LogBaseUrl = `https://hk4e-api-os.mihoyo.com/ysulog/api/getPrimogemLog`;

let AuthKey = ''
let AuthKeyVer = '1'
let Lang = 'zh-cn'
let game_biz = '1'
let selfquery_type = '1'
let sign_type = '1'
// let auth_appid = 'webview_gacha'
let auth_appid = 'bill-record-user'

const mask = document.createElement('div')
mask.style = 'position: fixed;top: 0;bottom: 0;left: 0;right: 0;background: #000e;z-index: 99999;color: #fff;padding: 20px;font-size: 12px;overflow-y: auto;'
document.body.append(mask)

function htmlLog(str) {
	console.log(str)
	mask.innerHTML = `${str}<br>` + mask.innerHTML
}

function fetch2() {
	return fetch(...arguments).then((res) => res.json()).then(ret => {
		if (ret.retcode !== 0) {
			htmlLog(ret.message || '請求失敗!')
			return Promise.reject(ret)
		}
		return ret
	}, err => {
		htmlLog('網路錯誤!')
		return Promise.reject(err)
	})

}

function loadScript(src) {
	return new Promise((resolve, reject) => {
		if (document.querySelector(`script[src="${src}"]`)) {
			resolve();
		}
		const s = document.createElement("script");
		s.src = src;
		s.onload = resolve;
		s.onerror = reject;
		document.body.append(s);
	});
}

async function getLog(end_id) {
	return fetch2(
		LogBaseUrl +
		`?authkey=${AuthKey}` +
		`&game_biz=${game_biz}`+
		`&selfquery_type=${selfquery_type}`+
		`&lang=${Lang}` +
		`&sign_type=${sign_type}`+
		`&authkey_ver=${AuthKeyVer}` +
		// `&auth_appid=${auth_appid}` +
		`&size=${20}` +
		`&end_id=${end_id}`
	)
		.then((data) => data);
}

async function getLogs() {
	let page = 1,
		data = [],
		res = [];
	let end_id = "0";
	let list = [];
	do {
		// htmlLog(`正在获取${name}第${page}页`);
		htmlLog(`正在獲取第${page}頁`);
		res = await getLog(end_id);
		// await sleep(0.2);
		end_id = res.data.list.length > 0 ? res.data.list[res.data.list.length - 1].id : 0;
		list = res.data.list;
		data.push(...list);
		page += 1;
	} while (list.length > 0);
	return data;
}

function pad(num) {
	return `${num}`.padStart(2, "0");
}

function getTimeString() {
	const d = new Date();
	const YYYY = d.getFullYear();
	const MM = pad(d.getMonth() + 1);
	const DD = pad(d.getDate());
	const HH = pad(d.getHours());
	const mm = pad(d.getMinutes());
	const ss = pad(d.getSeconds());
	return `${YYYY}${MM}${DD}_${HH}${mm}${ss}`;
}

async function main() {
	htmlLog("start load script");
	await loadScript(ExcelJSUrl);
	htmlLog("load exceljs success");
	await loadScript(FileSaverUrl);
	htmlLog("load filesaver success");
	const uri = new URL(window.location.href)
	AuthKey = uri.searchParams.get('authkey')
	if (!AuthKey) {
		htmlLog('AuthKey 獲取失敗!')
		alert('AuthKey 獲取失敗!')
		return
	}
	if (AuthKey.includes('/')) {
		AuthKey = encodeURIComponent(AuthKey)
	}
	AuthKeyVer = uri.searchParams.get('authkey_ver') || '1'
	Lang = uri.searchParams.get('lang') || 'zh-cn'

	// const gachaTypes = await fetch2(`${GachaTypesUrl}?authkey=${AuthKey}&authkey_ver=${AuthKeyVer}&lang=${Lang}`)
	// 	.then((data) => data.data.gacha_type_list);
	// htmlLog("获取抽卡活动类型成功");

	// htmlLog("开始获取抽卡记录");
	const workbook = new ExcelJS.Workbook();

	const sheet = workbook.addWorksheet("原石", {
		views: [{
			state: "frozen",
			ySplit: 1
		}],
	});
	sheet.columns = [{
		header: "時間",
		key: "time",
		width: 24
	}, {
		header: "原因",
		key: "reason",
		width: 14
	},  {
		header: "獲得/消耗數量",
		key: "add_num",
		width: 14
	}, ];
	// get gacha logs
	const logs = (await getGachaLogs()).map((item) => {
		// const match = data.find((v) => v.item_id === item.item_id);
		return [
			item.time,
			item.reason,
			item.add_num,
		];
	});
	logs.reverse();
	// idx = 0;
	// pdx = 0;
	// for (log of logs) {
	// 	idx += 1;
	// 	pdx += 1;
	// 	log.push(idx, pdx);
	// 	if (log[3] === 5) {
	// 		pdx = 0;
	// 	}
	// }
	// htmlLog(logs);
	sheet.addRows(logs);
	// set xlsx hearer style
	["A", "B", "C"].forEach((v) => {
		sheet.getCell(`${v}1`).border = {
			top: {
				style: "thin",
				color: {
					argb: "ffc4c2bf"
				}
			},
			left: {
				style: "thin",
				color: {
					argb: "ffc4c2bf"
				}
			},
			bottom: {
				style: "thin",
				color: {
					argb: "ffc4c2bf"
				}
			},
			right: {
				style: "thin",
				color: {
					argb: "ffc4c2bf"
				}
			},
		};
		sheet.getCell(`${v}1`).fill = {
			type: "pattern",
			pattern: "solid",
			fgColor: {
				argb: "ffdbd7d3"
			},
		};
		sheet.getCell(`${v}1`).font = {
			name: "微软雅黑",
			color: {
				argb: "ff757575"
			},
			bold: true,
		};
	});
	// set xlsx cell style
	logs.forEach((v, i) => {
		["A", "B", "C"].forEach((c) => {
			sheet.getCell(`${c}${i + 2}`).border = {
				top: {
					style: "thin",
					color: {
						argb: "ffc4c2bf"
					}
				},
				left: {
					style: "thin",
					color: {
						argb: "ffc4c2bf"
					}
				},
				bottom: {
					style: "thin",
					color: {
						argb: "ffc4c2bf"
					}
				},
				right: {
					style: "thin",
					color: {
						argb: "ffc4c2bf"
					}
				},
			};
			sheet.getCell(`${c}${i + 2}`).fill = {
				type: "pattern",
				pattern: "solid",
				fgColor: {
					argb: "ffebebeb"
				},
			};
			sheet.getCell(`${c}${i + 1}`).font = {
				name: "微软雅黑",
				color: {
					argb: "ff757575"
				},
			};
		});
	});
	
	htmlLog("正在導出");
	const filename = `原神原石紀錄_${getTimeString()}.xlsx`
	try {
		const buffer = await workbook.xlsx.writeBuffer();
		saveAs(
			new Blob([buffer], { type: "application/octet-stream" }),
			filename
		);
		htmlLog("導出成功: " + filename);
	} catch (e) {
		htmlLog(`導出失败: ${e}`);
	}
}

if (!window.location.host.endsWith('mihoyo.com')) {
	htmlLog('請在原石獲得頁面執行!')
} else {
	main()
}