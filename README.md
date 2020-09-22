# PostCSS Px2units Plus

将 px 单位转换为 rpx 单位，或者其他单位的[PostCSS](https://github.com/ai/postcss) 插件。

基于[postcss-px2units](https://github.com/yingye/postcss-px2units) 增强
+ 增加指定选择器转换
+ 增加指定属性转换
+ 增加规则注释

## Install

```sh
npm install --save-dev postcss postcss-px2units-plus
```

在postcs配置文件中添加以下内容`postcs.config.js`

```js
module.exports = {
  plugins: [
   require('postcss-px2units-plus'),
  ]
}
```


## Usage

### Input/Output

如果使用 默认的 opts，将会得到如下的输出。

```css
/* input */
p {
  margin: 0 0 20px;
  font-size: 32px;
  line-height: 1.2;
  letter-spacing: 1px; /* no */
}

/* output */
p {
  margin: 0 0 20rpx;
  font-size: 32rpx;
  line-height: 1.2;
  letter-spacing: 1px;
}
```

### 配置

Type: Object | Null

Default:

```js
{
    /**
     * 除数 int 默认值:1
     * 把像素相除  100 / divisor * multiple
     * width:20px / 1  = width:20px
     */
    divisor: 1,

    /**
     * 倍数 int
     * 把像素相乘  100 / divisor * multiple
     * width:20px * 1  = width:20px
     */
    multiple: 1,

    /**
     * 小数点后保留的位数 int 默认值:rpx
     * Number(100 / divisor * multiple).toFixed(decimalPlaces)
     * width:20.001px * 1  = width:20.00px
     */
    decimalPlaces: 2,

    /**
     * 转换单位 string 默认值:rpx
     * 设置其值为 'rem'，px将会被转换为rem。
     */
    targetUnits: 'rpx',

    /**
     * 限定选择器 string|RegExp
     * 仅转换指定选择器样式
     * 设置值: .my-box  只转换.my-box
     * 设置值: /\.my-b/  转换.my-box,.my-item ,.my-title等
     * 设置值: /title$/  转换.my-title,.u-title$ ,.title等
     */
    selector: null,

    /**
     * 属性限定 array|RegExp
     * 仅转换指定属性,为空表示所有
     * 设置值: ['width']  只转换width
     * 设置值: ['width','font-size']  只转换width,font-size
     */
    onlyAttr: [],

    /**
     * 启用转换注释,属性限定单独全部转换
     * 写在每条css规则前面
     * 如属性限定设置值: ['width']
     * 转换规则
     * ps:本注释\为转义符,实际写过程中不用包含
     * /* px2units-enable *＼/
     * .title{width:30px;font-size:20px}
     * 转换后
     * .title{width:30rpx;font-size:20rpx}
     */
    enableAllComment: 'px2units-enable',

    /**
     * 禁用转换注释,任何情况下,有该注释不转换
     * 写在每条css规则前面
     * 转换规则
     * ps:本注释\为转义符,实际写过程中不用包含
     * /* px2units-disable *＼/
     * .title{width:30px;font-size:20px}
     * 转换后
     * .title{width:30px;font-size:20px}
     */
    disableAllComment: 'px2units-disable',

    /**
     * 单条css样式不转换注释  默认为 /*no*\/
     * ps:本注释\为转义符,实际写过程中不用包含
     * .title{
     *  width:30px; /*no*\/
     *  font-size:20px
     * }
     *  .title{
     *  width:30px; /*no*\/
     *  font-size:20rpx
     * }
     */
    comment: 'no'
  }
```

### Example

**双倍转换** 将px 转换为2倍rpx
```js
module.exports = {
  plugins: [
   require('postcss-px2units-plus',{
    multiple: 2
   })
  ]
}
```
```css
/* input */
p {
  margin:20px;
}

/* output */
p {
  margin: 40rpx;
}
```


**限定选择器** 只转换指定前缀选择器
```js
module.exports = {
  plugins: [
   require('postcss-px2units-plus',{
     multiple: 2,
    selector: /\.my-/
   })
  ]
}
```
```css
/* input */
.my-title {
  margin:20px;
}

.u-title {
  margin:20px;
}


/* output */
.my-title {
  margin:40rpx;
}

.u-title {
  margin:20px;
}
```

**限定属性** 限定选择器+限定属性
```js
module.exports = {
  plugins: [
   require('postcss-px2units-plus',{
     multiple: 2,
    selector: /\.my-/,
    onlyAttr: ['padding'], //支持正则,数组,字符串
   })
  ]
}
```
```css
/* input */
.my-title {
     padding: 30px;
     margin: 40px;
}

.u-title {
    padding: 30px;
    margin: 40px;
}

/* output */
.my-title {
    padding: 60px;  /* 只改变这个值 */
    margin: 40px;
}

.u-title {
   padding: 30px;
   margin: 40px;
}
```


**独立注释** 限定选择器配合限定属性时,可通过注释单独指定规则
```js
module.exports = {
  plugins: [
   require('postcss-px2units-plus',{
     multiple: 2,
    selector: /\.my-/,
    onlyAttr: ['padding'], //支持正则,数组,字符串
   })
  ]
}
```
```css
/* input */
.my-title {
     padding: 30px;
     margin: 40px;
}

.my-title2 {
    padding: 30px;
    margin: 40px;
}

/* output */

/* 开启全部属性转换, 开启注释要放到最后 */
/*px2units-enable*/
.my-title {
    padding: 60px;
    margin: 80px;
}

.my-title2 {
   padding: 60px;
   margin: 40px;
}
```
