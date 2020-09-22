'use strict';
const postcss = require('postcss')

module.exports = postcss.plugin('postcss-px2units-plus', options => {
  const opts = Object.assign({}, {
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
  }, options)

  const declsSelector = opts.onlyAttr instanceof Array ? new RegExp(opts.onlyAttr.join('|')) : opts.onlyAttr

  /**
   * 替换PX
   * @param str 对象属性
   * @returns {string|*}
   */
  const replacePx = (str) => {
    if (!str) return ''
    return str.replace(/\b(\d+(\.\d+)?)px\b/ig, function (match, x) {
      const size = x * opts.multiple / opts.divisor
      return size % 1 === 0 ? size + opts.targetUnits : size.toFixed(opts.decimalPlaces) + opts.targetUnits
    })
  }

  /**
   * 验证是否替换,有样式注释则取消
   * @param decl 规则对象  font-size: 16px;* no *
   */
  const checkReplace = (decl) => {
    if (decl && decl.next() && decl.next().type === 'comment' && decl.next().text === opts.comment) {
      decl.next().remove()
    } else {
      decl.value = replacePx(decl.value)
    }
  }

  /**
   * 遍历规则
   * @param rule
   */
  const walkRules = (rule) => {
    if (rule && rule.prev() && rule.prev().type === 'comment') {   // 存在规则级注释
      if (rule.prev().text === opts.enableAllComment) {         //全部启用注释, 则取消属性选择器
        rule.walkDecls(checkReplace)
        rule.prev().remove()
      } else if (rule.prev().text === opts.disableAllComment) { // 禁用转换,则取消操作
        rule.prev().remove()
      }
    } else {
      // 没有注释,默认操作
      rule.walkDecls(declsSelector, checkReplace)
    }
  }

  return (root) => {
    if (opts.selector) {
      root.walkRules(opts.selector, walkRules)
    } else {
      root.walkRules(walkRules)
    }
  }
})
