<template>
	<view class="content">
		

		<view class="text-area">
			<button @click="captcha_sent">获取</button>
			<input class="uni-input1"  v-model="code" />
			<button @click="login_cellphone">提交</button>
			<button @click="refresh">刷新</button>
		</view>
		<view class="content-search">
			<view class="">
				<picker mode="selector" :value="searchValue" :range="searchTypeArr" @change="bindPickerChange">
					<view>{{searchTypeArr[searchValue]}}</view>
				</picker>
			</view>
		 	<input class="uni-input1" type="text"  v-model="keywords"/>
			<input type="button" value="搜索" @click="search"/>
		</view>
		<view class="content-list">
			<view v-for="(item,index) in list" :key="index" style="display: flex;justify-content: space-between;	">
				<text @click="checkAudio(item)">{{item.songname}}</text> 
				<button type="button" @click="uploadAndStoreInDatabase(item)">下载</button>
			</view>
		</view>
		<view>
			<button @click="pauseAudio">暂停</button>
			<button @click="playAudio">继续</button>
		</view>

		<!-- <unicloud-db v-slot:default="{data, loading, error, options}" collection="contact">
			<view v-if="error">{{error.message}}</view>
			<view v-else>
				{{data}}
			</view>
		</unicloud-db> -->
		
	</view>
</template>


<script>
		// hash  6E08905EB29772BE334FB88240745CF4d
		// 抖音热歌榜 52144   酷狗500 8888
		// let song  = await uniCloud.callFunction({
		// 	name:"get_song/singer_list",
		// 	data:{a:1,b:2}
		// })
	export default {
		data() {
			return {
				title: 'Hello',
				video_url: '',
				innerAudioContext:null,
				list:[],
				get_song:null,
				mobile:'18310564049',
				code:'',
				token:'',
				userid:0,
				db: uniCloud.database(),
				keywords:'光良',
				searchValue:0,
				searchTypeArr:['歌曲','歌手'],
				res:null
			}
		},
		async onLoad() {
		 this.innerAudioContext = uni.createInnerAudioContext();
		 this.innerAudioContext.autoplay = false;
		 this.innerAudioContext.loop = true
		 this.innerAudioContext.onPlay(() => {
		 	console.log('开始播放');
		 });
		 this.innerAudioContext.onError((res) => {
		 	console.log(res.errMsg);
		 	console.log(res.errCode);
		 });
		 this.get_song = uniCloud.importObject("get_song")
		 // this.captcha_sent()
		 await this.recommend_songs();
		 await this.everyday_recommend()
		 await this.everyday_history();
		 this.getSongList()
		},
		methods: {
			getPhone(){
				console.log(1111)
				wx.login({
				  success(res) {
				    if (res.code) {
				      // 发送 res.code 到后台换取 openId, sessionKey, unionId
				    } else {
				      console.log('登录失败！' + res.errMsg)
				    }
				  }
				})
			},
			bindPickerChange(e){
				 this.searchValue = e.detail.value
			},
			async getURL(fileID) {
				 // fileID = "https://mp-cf5725de-2959-4c6d-97db-245e963e33a5.cdn.bspapp.com/cloudstorage/81ec6fc7-06e2-4496-9156-8ce60cf6f1a8."
				let url = await this.getAudioFileURL(fileID)
				console.log(url)
			},
			async getAudioFileURL(fileID) {
			    return new Promise((resolve, reject) => {
			        uniCloud.getTempFileURL({
			            fileList: [fileID],
			            success: (res) => {
			                if (res.fileList && res.fileList.length > 0) {
								console.log(res)
			                    resolve(res.fileList[0].tempFileURL);
			                } else {
			                    reject(new Error('Failed to get file URL'));
			                }
			            },
			            fail: (err) => {
			                reject(err);
			            }
			        });
			    });
			},
			async  deleteAudioFromCloudStorage(fileID) {
			    return new Promise((resolve, reject) => {
			        uniCloud.removeFile({
			            fileID: "https://mp-cf5725de-2959-4c6d-97db-245e963e33a5.cdn.bspapp.com/cloudstorage/81ec6fc7-06e2-4496-9156-8ce60cf6f1a8.",
			            success: (res) => {
			                resolve(res);
			            },
			            fail: (err) => {
			                reject(err);
			            }
			        });
			    });
			},
			async requestHttp(url,params){
				// let obj = {}
				let obj = {cookie:{userid:'911143019',token:this.token}}
				Object.assign(obj,params)
				return await this.get_song[url](obj)
			},
			async login_cellphone() {
				console.log('code',this.code)
				let res = await this.get_song.login_cellphone({mobile:this.mobile,code:this.code})
				this.token = res.body.data.token
				localStorage.setItem("token",this.token)
				this.userid = res.body.data.userid
				console.log('gongjie',res)
			
			},
			async captcha_sent() {
				let res = await this.get_song.captcha_sent({mobile:this.mobile})
				console.log('gongjie',res)

			},
			async refresh(){
				let token = localStorage.getItem('token')
				let res = await this.get_song.login_token({token:token,userid:'911143019'})
				console.log('res',res)
			},
			async recommend_songs() {
				let obj = {cookie:{userid:'911143019',token:'e7dbf735140e5d96b9a6651db4e8838d208e43dff5b7b9171f214d6ded0bb592'}}
				let res = await  this.requestHttp('recommend_songs',obj)
				this.res = res
				let data = res.body.data
				this.list = data.song_list.filter(item => item.privilege === 8)
				this.list.splice(1,4)
			},
			async recommend_songs1() {
				let obj = {cookie:{userid:'911143019',token:'e7dbf735140e5d96b9a6651db4e8838d208e43dff5b7b9171f214d6ded0bb592'}}
				let res = await this.get_song.recommend_songs(obj)
				let data = res.body.data
				this.list = data.song_list.filter(item => item.privilege === 8)
				 
			},
			async everyday_recommend() {
				let res = await this.requestHttp('everyday_recommend')
				// console.log('res',res)
				let data = res.body.data
				let curList = data.song_list.filter(item => item.privilege === 8)
				this.list = [...this.list,...curList]
			},
			async everyday_history() {
				let res = await this.requestHttp('everyday_history')
				// console.log('res',res)
				let data = res.body.data
				data.lists.forEach(item =>{
					let curList = item.song_list.filter(item => item.privilege === 8)
					this.list = [...this.list,...curList]
				})
			},
			
			
			async checkAudio(item){
				let audio_url
				if(!item.url){
					let res1 = await this.requestHttp("song_url",{
						hash: item.hash
					})
					audio_url = res1.body.url[0];
				}else{
					audio_url = item.url
				}
			
				this.innerAudioContext.pause()
				this.innerAudioContext.src = audio_url
				this.innerAudioContext.play()
			},
			async song_url(item){
				let res1 = await this.requestHttp("song_url",{
					hash: item.hash
				})
				item.url = res1.body.url[0];
				return
			},
			
			async  uploadAudioToCloudStorage(audioBuffer, fileName) {
			    const fileExtension = fileName.split('.').pop();
			    const cloudPath = `audios/${Date.now()}.${fileExtension}`;
			
			    return new Promise((resolve, reject) => {
			        uniCloud.uploadFile({
			            filePath: audioBuffer,
			            cloudPath: fileName,
			            success: (res) => {
							console.log(res)
							res.fileName = fileName
			                resolve(res);
			            },
			            fail: (err) => {
			                reject(err);
			            }
			        });
			    });
			},
			async  storeAudioFilePathInDatabase(fileID, filePath,fileName) {
			    try {
			        const result = await this.db.collection('audio_files').add({
			                filePath: filePath,
			                fileID: fileID,
							fileName:fileName
			        });
			        console.log(`New audio file created with the following id: ${result.id}`);
			    } catch (error) {
			        console.error('Error storing audio file path in database:', error);
			    }
			},
			async uploadAndStoreInDatabase(item){
				if(item.url){
					const fileObj = await this.uploadAudioToCloudStorage(item.url,item.filename+'.'+item.extname||'')
					// await this.getURL(fileID)
					this.storeAudioFilePathInDatabase(fileObj.fileID,fileObj.filePath,fileObj.fileName)
				} 
			},
			async getSongList(list){
				this.list.forEach(item => {
					this.song_url(item)
				})
			},
			async  search(){
				let res = await this.requestHttp("search",{
					keywords: this.keywords,
					pagesize :80,
					type:this.searchValue?'author':"song"
				})
				
				let list = res.body.data.lists.filter(item => item.Privilege === 8)
				list.forEach(item =>{
					item.songname = item.FileName
					item.hash = item.FileHash
				})
				this.list = list
				console.log(list)
			},
			pauseAudio() {
				this.innerAudioContext.pause()
			},
			playAudio() {
				this.innerAudioContext.play()
			},
		}
	}
</script>

<style>
	button{
		width: 60px;
		height: 24px;
		text-align: center;
		line-height: 24px;
		font-size: 12px;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		
	}
     .uni-input1{
		line-height: 24px;
		border: 1px solid gray;
		border-radius: 1px;
		border-color: antiquewhite;
	}
	.content-search{
		display: flex;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>