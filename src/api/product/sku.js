// 平台属性管理模块请求文件
import request from "@/utils/request";

// SKU 列表的接口
// /admin/product/list/{page}/{limit}
export const reqSkuList = (page,limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' });

// 上架
// /admin/product/onSale/{skuId}
export const reqSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' });

// 下架
// /admin/product/cancelSale/{skuId}
export const reqCancel = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' });

// 获取 SKU 详情的接口
// /admin/product/getSkuById/{skuId}  get
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: 'get' });
