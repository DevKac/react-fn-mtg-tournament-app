import { PENDING } from '../../consts/requestState';

export const isPending = (state) => {
  return state === PENDING;
}
