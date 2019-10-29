<template>
    <div>
        <ul class="mui-table-view">
				<li class="mui-table-view-cell mui-media" v-for="item in newsList" :key="item.id">
					<router-link to="/home/newsdetail">
						<img class="mui-media-object mui-pull-left" :src="item.picpath">
						<div class="mui-media-body">
							<h1>{{ item.zhaiyao }}</h1>
							<p class='mui-ellipsis'>
                                <span>发表时间:{{ item.addtiem | dataFormat('YYYY-MM-DD') }}</span>
                                <span>点击:{{ item.click }}</span>
                            </p>
						</div>
					</router-link>
				</li>
			</ul>
    </div>
</template>

<script>
export default {
    data(){
        return {
            newsList:[
                {id:1,zhaiyao:'想要这样一间小木屋，夏天挫冰吃瓜，冬天围炉取暖',addtiem:'2019-10-25',click:1,picpath:'../../imgs/我.jpg'},
                {id:2,zhaiyao:'烤炉模式的城，到黄昏，如同打翻的调色盘一般.',addtiem:'2019-10-25',click:1,picpath:'../../imgs/汪潼.jpg'},
                {id:3,zhaiyao:'想要这样一间小木屋，夏天挫冰吃瓜，冬天围炉取暖',addtiem:'2019-10-25',click:0,picpath:'../../imgs/秦伟.jpg'},
                {id:4,zhaiyao:'想要这样一间小木屋，夏天挫冰吃瓜，冬天围炉取暖',addtiem:'2019-10-25',click:1,picpath:'../../imgs/网通.jpg'},
                {id:5,zhaiyao:'烤炉模式的城，到黄昏，如同打翻的调色盘一般.',addtiem:'2019-10-25',click:12,picpath:'../../imgs/汪潼.jpg'},
                {id:6,zhaiyao:'想要这样一间小木屋，夏天挫冰吃瓜，冬天围炉取暖',addtiem:'2019-10-25',click:0,picpath:'../../imgs/汪潼.jpg'}
            ]
        }
    },
    created(){
        // this.getAllLists()
    },
    methods:{
        //这里假定有个API接口
        // getAllLists(){
        //     this.$http.get('http://').then(result=>{
        //         if(result.body.status === 0){
        //             this.newsList = result.body.message;//将API接口中请求到的数据绑定到当前data中
        //         }
        //         else{
        //             Toast('获取新闻列表失败')
        //         }
        //     })
        // }
    }
}
</script>

<style  scoped>
    .mui-media-body h1{
        font-size: 12px
    }
    .mui-media-body p{
        display: flex;
        justify-content: space-between
    }
</style>



