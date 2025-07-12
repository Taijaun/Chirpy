import { NextFunction, Request, Response } from "express";
import { getBearerToken, hashPassword } from "../auth/auth";
import { getUserIDByToken, lookupTokenInDb } from "../db/queries/tokens";
import { BadRequestError, UnauthorizedError } from "../middleware/errorHandler";
import { selectUserById, updateUserEmail, updateUserPassword } from "../db/queries/users";
import { NewUser } from "../db/schema";


export async function updateUserDetails(req: Request, res: Response, next: NextFunction){
    const userToken = getBearerToken(req);
    const tokenValid = await lookupTokenInDb(userToken);

    if (tokenValid.length < 1){
        throw new UnauthorizedError("Token invalid");
    }

    const userId = await getUserIDByToken(tokenValid[0].userId);

    if (!userId){
        throw new UnauthorizedError("User ID does not exist");
    }

    const user = await selectUserById(userId.userId);

    if (!user){
        throw new UnauthorizedError("User does not exist");
    }

    if (req.body.email){
        const newUserEmail = await updateUserEmail(user, req.body.email);
    }
    if (req.body.password){
        const newHashedPassword = await hashPassword(req.body.password);
        const newUserPassword = await updateUserPassword(user, newHashedPassword);
    }

    if (!(req.body.email) && !(req.body.password)){
        throw new BadRequestError("Invalid request parameters")
    }

    const updatedUser = await selectUserById(userId.userId);

    type UpdatedUserInfo = Omit<NewUser, "hashedPassword">

    const userResponse: UpdatedUserInfo = {
        id: updatedUser.id,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        email: updatedUser.email
    };

    res.status(200).json(userResponse);

}