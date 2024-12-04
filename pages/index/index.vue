<template>
	<view class="content">
		<view class="text-area">
			<button @click="call">获取</button>
		</view>
		<view v-for="(item,index) in list" key="index">
			<text @click="checkAudio(item.hash)">{{item.songname}}</text>
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
	export default {
		data() {
			return {
				title: 'Hello',
				video_url: '',
				innerAudioContext:null,
				list:[],
				get_song:null
			}
		},
		onLoad() {
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
		},
		methods: {
			async call() {
				
				let res = await this.get_song.recommend_songs()
				// let song  = await uniCloud.callFunction({
				// 	name:"get_song/singer_list",
				// 	data:{a:1,b:2}
				// })

				let data = res.body.data
				let hash = data.song_list[0]?.hash
				this.list = data.song_list.filter(item => item.privilege === 8)
				
				// let res1 = await get_song.song_url({
				// 	hash: "6E08905EB29772BE334FB88240745CF4"
				// })
				// console.log(res1)
				// let video_url = res1.body.url[0];
				// this.checkAudio(video_url)
				// uni.showModal({
				// 	content: JSON.stringify(res1.body.url[0])
				// })
			},
			async checkAudio(hash){
				let res1 = await this.get_song.song_url({
					hash: hash
				})
				//6E08905EB29772BE334FB88240745CF4
				console.log(res1)
				let video_url = res1.body.url[0];
				this.innerAudioContext.pause()
				this.innerAudioContext.src = video_url
				this.innerAudioContext.play()
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
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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