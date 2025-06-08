import { SetMetadata } from '@nestjs/common';

export const SELF_PARAM_KEY = 'self_param_key';

export const IsSelf = (paramKey: string = 'id') =>
  SetMetadata(SELF_PARAM_KEY, paramKey);
