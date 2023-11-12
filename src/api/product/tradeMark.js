// 这个模块主要是获取品牌管理数据的模块 
import request from '@/utils/request';

// 获取品牌列表接口  /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMark = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });

// 处理添加品牌  
// 新增品牌：/admin/product/baseTrademark/save   post   携带两个参数:品牌名称 品牌logo
// 切记：对于新增的品牌，给服务器传数据不需要传ID，由后台生成


// 修改品牌：/admin/product/baseTrademark/update  put   携带三个参数:id  品牌名称 品牌logo
// 方式是 method 不是 methods
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    // 如果带给服务器数据携带ID---修改数据
    if (tradeMark.id) {
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
    } else {
        // 新增品牌
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
    }
}

// 删除品牌接口  /admin/product/baseTrademark/remove/{id}  delete
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' });