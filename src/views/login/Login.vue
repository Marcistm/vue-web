<template>
    <div class="login">
        <!-- 登录面板 -->
        <div class="login-box">
            <div class="login-box-title">
                项目管理系统
            </div>
            <div class="login-box-from">
                <el-form :model="loginForm" :rules="rules" ref="loginForm"  class="demo-ruleForm">
                    <el-form-item prop="username" >
                        <el-input v-model="loginForm.username"  size="medium">
                            <el-button slot="prepend" icon="el-icon-user"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password" >
                        <el-input v-model="loginForm.password"   size="medium" type="password">
                            <el-button slot="prepend" icon="el-icon-key"></el-button>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="medium" :loading="loading" style="width:100%" @click="submitForm('loginForm')">登录</el-button>
                    </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="medium" :loading="loading" style="width:100%" @click="register">注册</el-button>
                  </el-form-item>
                </el-form>
            </div>
        </div>

    </div>

</template>

<script>
import axios from 'axios'
import { setUser, setUserName, getUser } from "@/utils/auth";

export default {
    data(){
        let letterRule = (rule, value, callback) => {
            let reg = /^[a-zA-Z0-9_-]{4,18}$/
            if (value === '') {
                callback(new Error('输入内容不能为空'));
            }else if(!reg.test(value)) {
                callback(new Error('请输入字母、数字、下划线'));
            }else{
                callback();
            }
        };
        return {
            loading: false, //登陆状态
            loginForm:{  // 登陆表单
                username: '',
                password: ''
            },
            rules:{  //登陆验证规则
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: letterRule, trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
      submitForm(formName){
          this.$refs[formName].validate((valid) => {
              if (valid) {
                  this.loading = true
                  this.login()
              } else {
                  console.log('error submit!!');
                  return false;
              }
          });
      },

      register(){
        localStorage.setItem('permission', '3')
        this.$store
            .dispatch('user/login',{token: 'sdadas'})
            .then(()=>{
              this.loading = true
              // 登陆成功后重定向
              // 如果初次登录跳转到更改密码页面
              setUserName(this.loginForm.username)
              this.$message.success('注册成功')
              this.$router.push('/')
            })
            .catch(err=>{
              this.loading = true
              // console.log(err)
            })

      },

      login(){
        if (this.loginForm.username === 'admin' && this.loginForm.password === '123456') {
          localStorage.setItem('permission', '3')
          this.$store
              .dispatch('user/login',{token: 'sdadas'})
              .then(()=>{
                this.loading = true
                setUserName('admin')
                this.$router.push('/')
              })
              .catch(err=>{
                this.loading = true
                // console.log(err)
              })
        }else {
          this.$message.error('用户名或密码错误')
          this.loading=false
          return
        }




      }
    }
}
</script>

<style scoped>
.login{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('../../assets/image/login.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
.login-box{
    width: 350px;
    /* height: 287px; */
    background: hsla(0,0%,100%,.3);
    border-radius: 5px;
    box-shadow: 0 0 2px #f7f7f7;
    border: 1px solid #f7f7f7;
}
.login-box-title{
    line-height: 50px;
    font-size: 20px;
    color: #ffffff;
    text-align: center;
    border-bottom: 1px solid #ffffff;
}
.login-box-from{
    width: 100%;
    height: auto;
    padding: 30px;
    box-sizing: border-box;
}
</style>
