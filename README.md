# PostCSS Px2units Plus

将 px 单位转换为 rpx 单位，或者其他单位的[PostCSS](https://github.com/ai/postcss) 插件。

居于[postcss-px2units](https://github.com/yingye/postcss-px2units) 增强
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
    //除数,转换后的值 等于 pixel / divisor
    divisor: 1,

    //倍数，转换后的值 等于 pixel * multiple
    multiple: 1,

    // 小数点后保留的位数，例如, width: 100px中的100，
    // 将会被转换成 Number(100 / divisor * multiple).toFixed(decimalPlaces)
    decimalPlaces: 2,

    //换单位，默认值为 rpx，如果设置其值为 'rem'，px将会被转换为rem。
    targetUnits: 'rpx',

    // 选择器, 支持正则, 比如.my- 只会替换.my-box
    selector: null,

    //只转换的属性,不在列表中的不转换,支持字符串,数组,正则
    onlyAttr: [],

    // 全部启用注释,
    enableAllComment: 'px2units-enable',

    // 全部禁用注释
    disableAllComment: 'px2units-disable',

    //不转换px单位的注释，默认为 /*no*/
    //如果设置 comment 的值为 'not replace', width: 100px 中的100px将不会被转换为 rpx。
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
