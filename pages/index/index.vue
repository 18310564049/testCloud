<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
			<button @click="call">点击</button>
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
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			 async call(){
				const col = uniCloud.importObject("col")
				// let res = await col.say()
				let song  = await uniCloud.callFunction({
					name:"get_song",
					data:{a:1,b:2}
				})
				
				
				uni.showModal({
					content:JSON.stringify(song)
				})
			}
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
