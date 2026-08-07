export class CreateInventoryDto {
  name: string;
  description: string;
  price: number;
  total: number;
  image: string;
  status: number;
  sku: string; //   商品SKU
  sign: Array<string>; //   商品签名
  category: string; //   商品类别
  remark: string; //   备注
  //
}
