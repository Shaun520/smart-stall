export class LoginDTO {
  username: string;
  phone: string;
  password: string;
}

export class CreateUserDTO {
  username: string;
  password: string;
  phone: string;
  nickname?: string;
}
