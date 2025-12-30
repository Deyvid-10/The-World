import mysql from "mysql2/promise";

const CONFIGURATION = {
  host: "localhost",
  user: "root",
  password: "Contrasena20",
  database: "social-media"
};

const connetion = await mysql.createConnection(CONFIGURATION)

export class Model{

    static async getMuchUsers (userName, userId){
        
        const [users] = await connetion.query(
            `
                SELECT u.users_id, u.users_img, u.users_name, u.users_last_name
                FROM users u
                WHERE UPPER(CONCAT(users_name, " ",users_last_name)) like ? 
                AND users_id != ?
            `, ["%" +  userName + "%", userId]
        )

        return users
    }

    static async getSuggestionsUsers (userLogged){
        
        const [users] = await connetion.query(
            `
                SELECT DISTINCT 
                u.users_id, u.users_img, u.users_name, u.users_last_name, follow_relation_id
                FROM users u
                LEFT JOIN follow_relation f
                ON u.users_id = f.follow_relation_followed
                WHERE u.users_id != ? and f.follow_relation_id IS NULL
                ORDER BY RAND()
                LIMIT 4
            `, [userLogged]
        )

        return users
    }

    
    static async followUser(userFollowed, userFollower){
        
               try{
            await connetion.query(`
                INSERT INTO follow_relation (follow_relation_followed, follow_relation_follower) 
                VALUES (?, ?)
                `, [userFollowed, userFollower]
        )}
        catch(e){
        console.error(e);
        
       }
    }   

    static async unfollowUser(userFollowed, userFollower){
        
               try{
            await connetion.query(`
                DELETE FROM follow_relation WHERE follow_relation_followed  = ? AND follow_relation_follower = ? 
                `, [userFollowed, userFollower]
        )}
        catch(e){
        console.error(e);
        
       }
    }   


     static async getPosts(userId){
            
            const [credentials] = await connetion.query(

            `
            SELECT p.posts_description, p.posts_likes, p.posts_img, p.posts_date, u.users_id, u.users_img, u.users_name, u.users_last_name
            FROM posts p
            LEFT JOIN users u
            ON p.posts_user = u.users_id
            WHERE u.users_id != ?
            `,
            [userId]
        )
        
        return credentials
    }

    static async getUserProfile(userId, id){
        
        const [userProfile] = await connetion.query(

            `
            SELECT DISTINCT CASE WHEN u.users_id = ? THEN "you" 
                    ELSE u.users_id END AS users_id, f.follow_relation_id, p.posts_description, p.posts_likes, p.posts_img, p.posts_date, u.users_img, u.users_name, u.users_last_name, u.users_bio
            FROM posts p
            RIGHT JOIN users u
            ON p.posts_user = u.users_id
            LEFT JOIN follow_relation f
            ON u.users_id = f.follow_relation_followed
            WHERE u.users_id = ?
            `,
            [id, userId]
        )             

        const [postsQuantity] = await connetion.query(

            `
            SELECT COUNT(p.posts_description) as posts_quantity
            FROM posts p
            RIGHT JOIN users u
            ON p.posts_user = u.users_id
            WHERE u.users_id = ?
            `,
            [userId]
        )

        const [userFollowers] = await connetion.query(

            `
            SELECT CASE WHEN uf.users_id = ? THEN "you" 
                    ELSE uf.users_id END AS users_id, f.follow_relation_follower, uf.users_img, uf.users_name, uf.users_last_name
            FROM follow_relation f
            INNER JOIN users u
            ON f.follow_relation_followed = u.users_id
            INNER JOIN users uf
            ON f.follow_relation_follower = uf.users_id
            WHERE u.users_id = ?
            `,
            [id, userId]
        )
        
        const [followersQuantity] = await connetion.query(

            `
            SELECT COUNT(f.follow_relation_follower) as followers_quantity
            FROM follow_relation f
            INNER JOIN users u
            ON f.follow_relation_followed = u.users_id
            WHERE u.users_id = ?
            `,
            [userId]
        ) 
        
        const [userFollowed] = await connetion.query(

            `
            SELECT f.follow_relation_followed, uf.users_id, uf.users_img, uf.users_name, uf.users_last_name
            FROM follow_relation f
            INNER JOIN users u
            ON f.follow_relation_follower = u.users_id
            INNER JOIN users uf
            ON f.follow_relation_followed = uf.users_id
            WHERE u.users_id = ?
            `,
            [userId]
        )
        

        const [followedsQuantity] = await connetion.query(

            `
            SELECT COUNT(f.follow_relation_followed) as followed_quantity
            FROM follow_relation f
            INNER JOIN users u
            ON f.follow_relation_follower = u.users_id
            WHERE u.users_id = ?
            `,
            [userId]
        )
        
        
        return {userProfile, postsQuantity, userFollowers, followersQuantity, userFollowed, followedsQuantity}
    }

    static async getLoginCredentials(email){

            const [credentials] = await connetion.query(

            `
            SELECT users_id, users_email, users_img, users_password
            FROM users 
            WHERE users_email = ?
            `,
            [email]
        )
        
        return credentials
    }

    static async signupValidation(email){

        const [validate] = await connetion.query(
            `
            SELECT users_email
            FROM users 
            WHERE users_email = ?
            `,
            [email]
        )
        
        return validate
    }

    static async insertSignupCredentials(credentials){
        
        await connetion.query(
            "INSERT INTO users ( `users_name`, `users_last_name`, `users_email`, `users_password`) VALUES (?, ?, ?, ?)",
            [...Object.values(credentials)]
        )
    }

    static async editProfile(credentials){
        await connetion.query(
            "UPDATE users SET users_img = ?, users_name = ?, users_last_name = ?, users_email = ?, users_password = ?, users_address = ?, users_postal_code = ?,  users_phone_number = ?, `users_credit-card` = ? WHERE users_id = 14",
            [...Object.values(credentials)]
        )
    }

    static async getUserData (id){
        const [user] = await connetion.query(
            `SELECT * 
            FROM users
            WHERE users_id = ?`,
            [id]
        )
        return user
    }

    static async insertComment(comment){
        
               try{
        await connetion.query(`
            INSERT INTO products_coments (products_coments_text, products_coments_rate, products_coments_date, products_coments_prod_id, products_coments_user) 
            VALUES (?, ?, ?, ?, ?)
            `, [...Object.values(comment)]
        )}
        catch(e){
        console.error(e);
        
       }
    }   
}