<template>
  <div>
    <mt-swipe :auto="4000">
      <!-- <mt-swipe-item v-for="item in piclist" :key="item.url">
          <img :src="item.img" alt="">
      </mt-swipe-item> -->
      <mt-swipe-item>1</mt-swipe-item>
      <mt-swipe-item>2</mt-swipe-item>
      <mt-swipe-item>3</mt-swipe-item>
    </mt-swipe>

    <ul class="mui-table-view mui-grid-view mui-grid-9">
		            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><router-link to="/home/newslist">
		                    <span class="mui-icon mui-icon-home"></span>
		                    <div class="mui-media-body">Home</div></router-link></li>
		            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
		                    <span class="mui-icon mui-icon-email"><span class="mui-badge">5</span></span>
		                    <div class="mui-media-body">Email</div></a></li>
		            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
		                    <span class="mui-icon mui-icon-chatbubble"></span>
		                    <div class="mui-media-body">Chat</div></a></li>
		            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
		                    <span class="mui-icon mui-icon-location"></span>
		                    <div class="mui-media-body">location</div></a></li>
		            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
		                    <span class="mui-icon mui-icon-search"></span>
		                    <div class="mui-media-body">Search</div></a></li>
		            <li class="mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-3"><a href="#">
		                    <span class="mui-icon mui-icon-phone"></span>
		                    <div class="mui-media-body">Phone</div></a></li>
		            
	</ul>

  </div>
</template>

<script>
// export default {
//   data() {
//     return {
//       piclist: []
//     };
//   },
//   created() {
//     this.getpic();
//   },
//   methods: {
//     getpic() {
//       this.$http.get("http://liulongbin.top:3005/api/getlunbo").then(result => {
//         console.log(result.body);
//       });
//     }
//   }
// };
</script>

<style scoped>
.mint-swipe {
  height: 100px;
}
.mint-swipe-item:nth-child(1) {
  background-color: aqua;
}
.mint-swipe-item:nth-child(2) {
  background-color: red;
}
.mint-swipe-item:nth-child(3) {
  background-color: blue;
}
</style>


