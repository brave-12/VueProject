// 平台属性管理模块请求文件
import request from "@/utils/request";

// 获取 SPU 列表数据的接口
// /admin/product/{page}/{limit}   page,limit,category3Id     category3Id  k和 v一致省略 v
export const reqSpuList = (page,limit,category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get' ,params:{category3Id}});

// 获取 SPU 信息
// /admin/product/getSpuById/{spuId}   get
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' });

// 获取品牌信息
// /admin/product/baseTrademark/getTrademarkList   get
export const reqTradeMarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' });

// 获取 SPU 图片的接口
// /admin/product/spuImageList/{spuId}  get
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });

// 获取平台全部销售属性----整个平台销售属性一共三个
// /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' });

// 修改SPU|添加SPU：对于修改或者添加  鞋带给服务器的参数大致一样  唯一的区别就是携带给服务器的参数是否有id
// /admin/product/updateSpuInfo    /admin/product/saveSpuInfo
export const reqAddOrUpdateSpu = (spuInfo) => {
    // 如果携带的参数有 id---修改spu
    if(spuInfo.id){
        return request({ url: `/admin/product/updateSpuInfo`, method: 'post',data:spuInfo });
    } else {
        // 携带的参数不带 id---添加SPU
        return request({ url: `/admin/product/saveSpuInfo`, method: 'post',data:spuInfo });
    }
}

// 删除 SPU
// /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' });



// 下面是添加 SKU 模块需要用到的接口

// 上面已经存在了
// export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });

// 获取销售属性的数据
// /admin/product/spuSaleAttrList/{spuId}  get
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' });

// 获取平台属性数据
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  get
export const reqAttrInfoList = (category1Id,category2Id,category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' });

// 添加 SKU
// /admin/product/saveSkuInfo
export const reqAddSku = (skuInfo) => request({ url: `/admin/product/saveSkuInfo`, method: 'post',data:skuInfo });

// 获取 SPU 列表数据的接口
// /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' });