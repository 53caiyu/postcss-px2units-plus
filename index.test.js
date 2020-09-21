const postcss = require('postcss')

const plugin = require('./')

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, {from: undefined})
  expect(result.css).toEqual(output)
  expect(result.warnings()).toHaveLength(0)
}

it('replace pixel values', async () => {
  await run(`.title{
      font-size: 24px;
      margin: 0 0 0 5px;
      vertical-align: -1px;
      display: flex;
    }`, `.title{
      font-size: 24rpx;
      margin: 0 0 0 5rpx;
      vertical-align: -1rpx;
      display: flex;
    }`, {})
})

it('rpx not be replaced', async () => {
  await run(`.title{ padding: 20rpx 30px 2rem 4em;}`,
    `.title{ padding: 20rpx 30rpx 2rem 4em;}`, {})
})

it('pixel values not be replaced', async () => {
  await run(`.title{
      padding: 20rpx 30px 2rem 4em; /* no */
      margin: 40px;
      font-size: 24px; /* no */
    }`, `.title{
      padding: 20rpx 30px 2rem 4em;
      margin: 40rpx;
      font-size: 24px;
    }`, {})
})

it('replace pixel values with px * opts.multiple', async () => {
  await run(`.title{
      padding: 30px;
      margin: 40px;
    }`, `.title{
      padding: 60rpx;
      margin: 80rpx;
    }`, {multiple: 2})
})

it('replace pixel values with rem units', async () => {
  await run(`.title{
     padding: 30px;
     margin: 40px;
    }`, `.title{
     padding: 10rem;
     margin: 13.333rem;
    }`, {
    divisor: 3,
    decimalPlaces: 3,
    targetUnits: 'rem'
  })
})


it('replace pixel in selector', async () => {
  await run(`.title{
     padding: 30px;
     margin: 40px;
    }
    .title1{
     padding: 30px;
     margin: 40px;
    }`, `.title{
     padding: 30px;
     margin: 40px;
    }
    .title1{
     padding: 30rpx;
     margin: 40rpx;
    }`, {
    selector: '.title1'
  })
})


it('replace pixel in regexp selector', async () => {
  await run(`.title{
     padding: 30px;
     margin: 40px;
    }
    .my-title-a{
     padding: 30px;
     margin: 40px;
    }`, `.title{
     padding: 30rpx;
     margin: 40rpx;
    }
    .my-title-a{
     padding: 30px;
     margin: 40px;
    }`, {
    selector: /.title$/
  })
})

it('disable replace comment', async () => {
  await run(`.title{
     padding: 30px;
     margin: 40px;
    }
    /* px2units-disable */
    .my-title{
     padding: 30px;
     margin: 40px;
    }`, `.title{
     padding: 30rpx;
     margin: 40rpx;
    }
    .my-title{
     padding: 30px;
     margin: 40px;
    }`, {
    selector: /.title$/
  })
})

it('Force all properties to be replaced', async () => {
  await run(`.title{
     padding: 30px;
     margin: 40px;
    }
    /*px2units-enable*/
    .my-title-a{
     padding: 30px;
     margin: 40px;
    }`, `.title{
     padding: 30rpx;
     margin: 40px;
    }
    .my-title-a{
     padding: 30rpx;
     margin: 40rpx;
    }`, {
    onlyAttr: ['padding']
  })
})

it('Replace only the specified attribute', async () => {
  await run(`.title{
     padding: 30px;
     margin: 40px;
    }
    .my-title-a{
     padding: 30px;
     margin: 40px;
    }`, `.title{
     padding: 30rpx;
     margin: 40px;
    }
    .my-title-a{
     padding: 30rpx;
     margin: 40px;
    }`, {
    onlyAttr: ['padding']
  })
})


it('work in media', async () => {
  await run(`@media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
   .word {
        margin-top: 30px;
        margin-bottom: 40px;
      }
      .word-retina {
        margin-top: 50px;
        margin-bottom: 60px;
      }
    }`, `@media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
   .word {
        margin-top: 30rpx;
        margin-bottom: 40rpx;
      }
      .word-retina {
        margin-top: 50rpx;
        margin-bottom: 60rpx;
      }
    }`, {})
})
