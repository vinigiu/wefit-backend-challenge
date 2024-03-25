import { User, UserAddress } from '@prisma/client';

export type CreateUserReturnType = {
    createdUser: User,
    createUserAddress: UserAddress,
}
