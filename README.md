# 辅助学习系统，前端部分

## 启动

先配置 craco
`yarn add -D @craco/craco`

然后启动
`yarn start `

## 前端页面

### 学生首页页面：

![图片](./src/assets/temp/%E5%AD%A6%E7%94%9F%E9%A6%96%E9%A1%B5.png)

### 学生个人信息页面：

![图片](./src/assets/temp/%E4%B8%AA%E4%BA%BA%E9%A1%B5%E9%9D%A2.png)

### 学生做题页面

![图片](./src/assets/temp/%E5%AD%A6%E7%94%9F%E5%81%9A%E9%A2%98%E9%A1%B5%E9%9D%A2.png)

### 登录页面

![图片](./src/assets/temp/%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2.png)

### 注册页面

![图片](./src/assets/temp/%E6%B3%A8%E5%86%8C%E9%A1%B5%E9%9D%A2.png)

### 题目管理页面

![图片](./src/assets/temp/%E9%A2%98%E7%9B%AE%E7%AE%A1%E7%90%86.png)

### 新增题目页面

![图片](./src/assets/temp/%E6%96%B0%E5%A2%9E%E9%A2%98%E7%9B%AE.png)

### 老师查看各班情况页面

![图片](./src/assets/temp/%E8%80%81%E5%B8%88%E6%9F%A5%E7%9C%8B%E5%90%84%E7%8F%AD%E6%83%85%E5%86%B5%E9%A1%B5%E9%9D%A2.png)

### 查看具体某班的某个题完成情况

![图片](./src/assets/temp/%E5%AE%8C%E6%88%90%E6%83%85%E5%86%B52.png)

### 查看具体某班的某个题某个人的完成情况

![图片](./src/assets/temp/%E5%AE%8C%E6%88%90%E6%83%85%E5%86%B53.png)

### 班级管理页面

![图片](./src/assets/temp/%E7%8F%AD%E7%BA%A7%E7%AE%A1%E7%90%86.png)

## 架构

### pages 页面，每个页面都应有自己的文件夹

### store 状态存储库，在这里设置需要全局访问的变量以及相关的业务

### utils 工具类，包含了 http 请求和 token

### app.js 页面存放路由

### components 里写一些可以复用的组件
