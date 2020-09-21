module.exports = (options = {}) => {
  const opts = Object.assign({}, {
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
  }, options)

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
   * 遍历规则替换CSS规则
   * @param decl 规则对象  font-size: 16px;* no *
   */
  const replaceDecl = (decl) => {
    if (decl && decl.next() && decl.next().type === 'comment' && decl.next().text === opts.comment) {
      decl.next().remove()
    } else {
      decl.value = replacePx(decl.value)
    }
  }

  return {
    postcssPlugin: 'postcss-px2units-plus',
    Root(root) {
      // 属性选择器
      const declsSelector = opts.onlyAttr instanceof Array ? new RegExp(opts.onlyAttr.join('|')) : opts.onlyAttr
      // 遍历规则
      const walkRules = (rule) => {
        if (rule && rule.prev() && rule.prev().type === 'comment') {   // 存在规则级注释
          if (rule.prev().text === opts.enableAllComment) {         //全部启用注释, 则取消属性选择器
            rule.walkDecls(replaceDecl)
            rule.prev().remove()
          } else if (rule.prev().text === opts.disableAllComment) { // 禁用转换,则取消操作
            rule.prev().remove()
          }
        } else {
          // 没有注释,默认操作
          rule.walkDecls(declsSelector, replaceDecl)
        }
      }

      if (opts.selector) {
        root.walkRules(opts.selector, walkRules)
      } else {
        root.walkRules(walkRules)
      }
    }
  }
}
module.exports.postcss = true
