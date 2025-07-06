import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string>{
    const saltRounds = 10;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (err) {
        console.log('Error hashing password:', err);
        throw err;
    }
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    const match = await bcrypt.compare(password, hash);

    if (match){
        return true;
    } else {
        return false;
    }
}