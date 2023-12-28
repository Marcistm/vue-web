import Vue from 'vue'
import Vuex from 'vuex'
import permission from './modules/permission'
import user from './modules/user'
import tagsView from './modules/tagsView'
import axios from "axios";
import router from "@/router";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    formatGMTTime(gmtTime) {
      if (!gmtTime) {
        return ""
      }

      const date = new Date(gmtTime)
      const year = date.getUTCFullYear().toString()
      const month = (date.getUTCMonth() + 1).toString().padStart(2, "0")
      const day = date.getUTCDate().toString().padStart(2, "0")
      const hours = date.getUTCHours().toString().padStart(2, "0")
      const minutes = date.getUTCMinutes().toString().padStart(2, "0")
      const seconds = date.getUTCSeconds().toString().padStart(2, "0")
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    previewMap(map) {
      const regex = /总装|装配/;
      if (regex.test(map)){
        localStorage.setItem('map',map)
        router.push({ path: '/AssemblePdf' });
      }else {
        let param = {
          map: map
        };
        let stream_path = "http://127.0.0.1:6325/tooling_process/preview";
        axios.get(stream_path, { params: param })
            .then((response) => {
              let stream_param = "?map=" + encodeURIComponent(map);
              window.open(
                  "/pdf/web/viewer.html?file=" +
                  encodeURIComponent(stream_path + stream_param)
              );
            })
            .catch((err) => {
              if (err.response.status === 402) {
                this.$message.warning(err.response.data.msg);
                this.$store.dispatch("user/resetToken");
              } else if (err.response.status === 500) {
                this.$message.error("服务器错误，联系管理员");
              } else {
                this.$message.error(err.response.data.msg);
              }
            });
      }

    },
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    permission,
    user,
    tagsView
  },
  // 定义全局getters 方便访问user 模块的roles
  getters:{
    roles: state => state.user.roles,
    permission_routes: state => state.permission.routes
  }
})
