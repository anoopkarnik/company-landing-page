import db from '../../src/index';
import bcrypt from 'bcryptjs';


async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

export async function createGuestUser() {
    try {
        const hashedPassword = await hashPassword('password');
        const guestUser = await db.user.create({
          data: {
            name: 'guest',
            email: 'guest@bsamaritan.com',
            password: hashedPassword,
            emailVerified: new Date(),
            role: 'USER', // Default role for a guest user
          },
        });
        console.log('Guest user created:', guestUser);
        return guestUser;
    } catch (error) {
    console.error('Error creating guest user:', error);
    }
    
}

export async function createAdminUser(){
    try {
        const hashedPassword = await hashPassword('password');
        const adminUser = await db.user.create({
          data: {
            name: 'admin',
            email: 'admin@bsamaritan.com',
            password: hashedPassword,
            emailVerified: new Date(),
            role: 'ADMIN', // Default role for a guest user
          },
        });
        console.log('Admin user created:', adminUser);
        return adminUser;
    } catch (error) {
    console.error('Error creating admin user:', error);
    }
}
    
