import {
	config
} from '@/config.js'

const http = {
	post(path, params, contentType = 'form', otherUrl) {
		return new Promise((resolve, reject) => {
			let url = (otherUrl || config.baseUrl) + path
			if (!checkUrl(url)) {
				reject('请求失败')
			}
			uni.request({
				method: 'POST',
				url,
				header: {
					"Content-Type": contentType === 'json' ? "application/json" :
						"application/x-www-form-urlencoded"
				},
				data: params,
				success: (res) => {
					console.log('request:POST请求' + config.baseUrl + path + ' 成功', res.data)
					resolve(res.data)
				},
				fail: (err) => {
					uni.showToast({
						title: '请求失败',
						icon: 'error'
					})
					console.error('request:请求' + config.baseUrl + path + ' 失败', err)
					reject('请求失败')
				}
			})
		})
	},

	get(path, params, otherUrl) {
		return new Promise((resolve, reject) => {
			let url = (otherUrl || config.baseUrl) + path
			if (!checkUrl(url)) {
				return
			}
			uni.request({
				url,
				data: params,
				success: (res) => {
					console.log('request:GET请求' + config.baseUrl + path + ' 成功', res.data)
					resolve(res.data)
				},
				fail: (err) => {
					uni.showToast({
						title: '请求失败',
						icon: 'error'
					})
					console.error('request:GET请求' + config.baseUrl + path + ' 失败', err)
					reject(err)
				}
			})

		})

	},

	async upload(path, fileArray, otherUrl) {
		if (typeof fileArray !== 'object') {
			console.error('request:参数错误,请传入文件数组')
			return
		}
		let url = (otherUrl || config.baseUrl) + path
		if (!checkUrl(url)) {
			return
		}
		let arr = []
		for (let i in fileArray) {
			const res = await uni.uploadFile({
				url: otherUrl || config.baseUrl + path,
				filePath: fileArray[i],
				name: 'file'
			})
			console.log(res)
			if (res[0]) {
				console.error('request:上传失败', res[0])
				return
			}
			arr.push(JSON.parse(res[1].data).data)
		}
		return arr
	},

}

function checkUrl(url) {
	let urlReg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
	if (!urlReg.test(url)) {
		console.error('request:请求路径错误' + url)
		return false
	}
	return true
}