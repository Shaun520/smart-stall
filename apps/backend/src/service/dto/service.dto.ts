export class smsSendDTO {
  phone: string;
}

export class frtAddDTO {
  image: string;
  image_type?: string;
  group_id?: string;
  user_id?: string;
  user_info: string;
}

export class frtGetDTO {
  group_id: string;
  user_id: string;
}

export class frtVerifyDTO {
  image: string;
  user_id: string;
  image_type?: string;
  group_id_list?: string;
}
