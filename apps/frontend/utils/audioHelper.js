export const textToSpeech = async (text, accessToken, options = {}) => {
	const url =
		`https://tsn.baidu.com/text2audio?tex=${encodeURIComponent(text)}&tok=${accessToken}&cuid=uni-app&ctp=1&lan=zh`;
	// 可选参数：音色（per）、语速（spd）、音调（pit）
	if (options.per) url += `&per=${options.per}`; // 0:普通女声,1:普通男声,3:情感合成...
	if (options.spd) url += `&spd=${options.spd}`; // 0-15，默认5
	const res = await uni.request({
		url,
		method: 'GET',
		sslVerify: false,
		responseType: 'arraybuffer' // 关键：接收二进制音频数据
	});
	return res.data; // 返回ArrayBuffer格式的音频
};

export const playAudio = (url) => {
	//#ifdef H5
	const audio = new Audio();
	audio.src = url;

	// 添加错误监听
	audio.addEventListener('error', function() {
		console.error('H5音频加载/播放错误:', audio.error);
	});

	const playPromise = audio.play();

	// 处理现代浏览器中play()返回的Promise
	if (playPromise !== undefined) {
		playPromise.catch(err => {
			console.error('H5音频播放被阻止:', err);
			// 通常是因为浏览器策略：音频播放必须由用户操作（如点击按钮）直接触发
		});
	}
	//#endif

	//#ifdef MP-WEIXIN
	const innerAudio = uni.createInnerAudioContext();
	innerAudio.src = url;
	innerAudio.play();
	//#endif

	//#ifdef APP-PLUS
	const player = plus.audio.createPlayer(url);

	player.addEventListener('play', () => {
		console.log('音频开始播放');
		uni.showToast({
			title: '开始播放',
			icon: 'none'
		});
	});

	player.addEventListener('ended', () => {
		console.log('音频播放结束');
		// 可以在这里进行资源清理，如删除临时音频文件
	});

	player.addEventListener('error', (e) => {
		console.error('音频播放发生错误:', e);
		uni.showToast({
			title: `播放失败: ${e.message}`,
			icon: 'none'
		});
	});

	player.play();
	//#endif
}





export function writeBase64ToTempFile(base64Data, fileName = 'temp_audio.mp3') {
    return new Promise((resolve, reject) => {
        // 去除Base64前缀（如果有）
        const base64Content = base64Data.replace(/^data:audio\/mpeg;base64,/, '');
        
        // #ifdef APP-PLUS
        plus.io.requestFileSystem(plus.io.PUBLIC_DOCUMENTS, (fs) => {
            fs.root.getFile(fileName, { create: true, exclusive: false }, (fileEntry) => {
                
                fileEntry.createWriter((writer) => {
                    // 将Base64数据转换为ArrayBuffer
                    const arrayBuffer = Uint8Array.from(atob(base64Content), c => c.charCodeAt(0));
                    
                    writer.onwrite = () => {
                        console.log('MP3文件写入成功');
                        // 返回文件路径，用于uni.uploadFile
                        resolve(fileEntry.toLocalURL());
                    };
                    
                    writer.onerror = (e) => {
                        console.error('写入文件失败:', e);
                        reject(e);
                    };
                    
                    // 写入数据
                    writer.write(arrayBuffer);
                    
                }, (error) => {
                    reject(error);
                });
                
            }, (error) => {
                reject(error);
            });
        }, (error) => {
            reject(error);
        });
        // #endif
    });
}