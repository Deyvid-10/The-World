import mysql from "mysql2/promise";
import dotenv from "dotenv";

// environment variable source
const envFile = process.env.ENV_FILE || "./dev.env";
dotenv.config({ path: envFile });

// Configure data base connection
const CONFIGURATION = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
};

const connetion = await mysql.createConnection(CONFIGURATION)

export class Model{

    static async insertPost (postData){
        
        await connetion.query(
            `
                INSERT INTO posts (posts_description, posts_date, posts_img, posts_user) VALUES (?, ?, ?, ?)
            `, [...Object.values(postData)]
        )
    }

    static async getMuchUsers (userName, idlogged){
        const [users] = await connetion.query(
            `
                SELECT DISTINCT
                CASE WHEN u.users_id IN (SELECT DISTINCT f2.follow_relation_followed FROM follow_relation f2 WHERE follow_relation_follower = ?) THEN true
                    ELSE false END AS isFollowed,
                u.users_id, u.users_img, u.users_name, u.users_last_name
                FROM users u
                WHERE UPPER(CONCAT(users_name, " ",users_last_name)) like ? 
                AND users_id != ?
            `, [idlogged, "%" +  userName + "%", idlogged]
        )

        return users
    }

    static async getSuggestionsUsers (userLogged){
        
        const [users] = await connetion.query(
            `
                SELECT DISTINCT 
                    CASE WHEN u.users_id IN (SELECT DISTINCT f2.follow_relation_followed FROM follow_relation f2 WHERE follow_relation_follower = ?) THEN true
                    ELSE false END AS isFollowed,
                u.users_id, u.users_img, u.users_name, u.users_last_name
                FROM users u
                WHERE u.users_id != ?  AND u.users_id NOT IN (SELECT DISTINCT f2.follow_relation_followed FROM follow_relation f2 WHERE follow_relation_follower = ?) 
                ORDER BY RAND()
                LIMIT 4
            `, [userLogged, userLogged,  userLogged]
        ) 
        return users 
    }

    static async followUser(userFollowed, userFollower){
            await connetion.query(`
                INSERT INTO follow_relation (follow_relation_followed, follow_relation_follower) 
                VALUES (?, ?)
                `, [userFollowed, userFollower])
    }   

    static async unfollowUser(userFollowed, userFollower){
      
            await connetion.query(`
                DELETE FROM follow_relation WHERE follow_relation_followed  = ? AND follow_relation_follower = ? 
                `, [userFollowed, userFollower]
        )
    }   

    static async like(postId, idLogged){

            await connetion.query(`
                INSERT INTO likes (likes_post_id, likes_user_id) 
                VALUES (?, ?)
                `, [postId, idLogged]
        )
    }   

    static async disLike(postId, idLogged){
            await connetion.query(`
                DELETE FROM likes WHERE likes_post_id  = ? AND likes_user_id = ? 
                `, [postId, idLogged]
        )
    }   


     static async getPosts(idLogged){

            const [postData] = await connetion.query(
                    
            `
                SELECT p.posts_id, p.posts_description, SUM(DISTINCT CASE WHEN l.likes_user_id = ? THEN 1 ELSE 0 END) AS liked, COUNT(DISTINCT l.likes_id) AS likes_quantity, COUNT(DISTINCT c.comments_id) AS comments_quantity, p.posts_img, p.posts_date, u.users_id, u.users_img, u.users_name, u.users_last_name
                FROM posts p
                LEFT JOIN users u
                ON p.posts_user = u.users_id
                LEFT JOIN comments c
                ON p.posts_id = c.comments_post_id 
                LEFT JOIN likes l
                ON p.posts_id = l.likes_post_id
                WHERE u.users_id != ? AND u.users_id IN (SELECT DISTINCT f2.follow_relation_followed FROM follow_relation f2 WHERE follow_relation_follower = ?) 
                GROUP BY  p.posts_id, u.users_id, p.posts_description, p.posts_img, p.posts_date, u.users_id, u.users_img, u.users_name, u.users_last_name
                ORDER BY p.posts_id DESC
            `,
            [idLogged, idLogged, idLogged]
        )           
            return postData
    }

    static async getUserProfile(idProfile, idLogged){
        
        const [userProfile] = await connetion.query(

            `
            SELECT CASE WHEN u.users_id = ? THEN "you" 
                    ELSE u.users_id END AS users_id, 
                    u.users_bio, u.users_img, u.users_name, u.users_last_name
            FROM posts p
            RIGHT JOIN users u
            ON p.posts_user = u.users_id
            WHERE u.users_id = ? 
            ORDER BY posts_id DESC
            `,
            [idLogged, idProfile]
        )   

        const [isFollowed] = await connetion.query(
            `   
                SELECT u.users_id, f.follow_relation_follower
                 FROM follow_relation f
                 INNER JOIN users u
                 ON f.follow_relation_followed = u.users_id
                WHERE u.users_id = ? AND f.follow_relation_follower = ?
            `, [idProfile, idLogged]

        )
        
        const [posts] = await connetion.query(
             `
                SELECT p.posts_id, p.posts_description, SUM(DISTINCT CASE WHEN l.likes_user_id = ? THEN 1 ELSE 0 END) AS liked, COUNT(DISTINCT l.likes_id) AS likes_quantity, COUNT(DISTINCT c.comments_id) AS comments_quantity, p.posts_img, p.posts_date, u.users_id, u.users_img, u.users_name, u.users_last_name
                FROM posts p
                LEFT JOIN users u
                ON p.posts_user = u.users_id
                LEFT JOIN comments c
                ON p.posts_id = c.comments_post_id 
                LEFT JOIN likes l
                ON p.posts_id = l.likes_post_id
                WHERE u.users_id = ? 
                GROUP BY  p.posts_id, u.users_id, p.posts_description, p.posts_img, p.posts_date, u.users_id, u.users_img, u.users_name, u.users_last_name
                ORDER BY p.posts_id DESC
            `,
            [idLogged, idLogged]
        )

        const [postsQuantity] = await connetion.query(

            `
            SELECT COUNT(p.posts_description) as posts_quantity
            FROM posts p
            RIGHT JOIN users u
            ON p.posts_user = u.users_id
            WHERE u.users_id = ?
            `,
            [idProfile]
        )

        const [userFollowers] = await connetion.query(

            `
            SELECT CASE WHEN uf.users_id = ? THEN "you" 
                    ELSE uf.users_id END AS users_id, 
                    CASE WHEN uf.users_id IN (SELECT DISTINCT f2.follow_relation_followed FROM follow_relation f2 WHERE follow_relation_follower = ?) THEN true
                    ELSE false END AS isFollowed,
                    f.follow_relation_follower, uf.users_img, uf.users_name, uf.users_last_name
            FROM follow_relation f
            INNER JOIN users u
            ON f.follow_relation_followed = u.users_id
            INNER JOIN users uf
            ON f.follow_relation_follower = uf.users_id
            WHERE u.users_id = ?
            `,
            [idLogged, idLogged, idProfile]
        )        
        
        const [followersQuantity] = await connetion.query(

            `
            SELECT COUNT(f.follow_relation_follower) as followers_quantity
            FROM follow_relation f
            INNER JOIN users u
            ON f.follow_relation_followed = u.users_id
            WHERE u.users_id = ?
            `,
            [idProfile]
        ) 
        
        const [userFollowed] = await connetion.query(

            `
            SELECT DISTINCT CASE WHEN uf.users_id = ? THEN "you" 
                    ELSE uf.users_id END AS users_id,

                    CASE WHEN uf.users_id IN (SELECT DISTINCT f2.follow_relation_followed FROM follow_relation f2 WHERE follow_relation_follower = ?) THEN true
                    ELSE false END AS isFollowed,
            f.follow_relation_followed, f.follow_relation_follower, uf.users_img, uf.users_name, uf.users_last_name
            FROM follow_relation f
            INNER JOIN users u
            ON f.follow_relation_follower = u.users_id
            INNER JOIN users uf
            ON f.follow_relation_followed = uf.users_id
            WHERE f.follow_relation_follower = ?
            `,
            [idLogged, idLogged, idProfile]
        )            

        const [followedsQuantity] = await connetion.query(

            `
                SELECT COUNT(f.follow_relation_followed) as followed_quantity
                FROM follow_relation f
                INNER JOIN users u
                ON f.follow_relation_follower = u.users_id
                WHERE u.users_id = ?
            `,
            [idProfile]
        )
        
        
        return {userProfile, posts, postsQuantity, userFollowers, followersQuantity, userFollowed, followedsQuantity, isFollowed}
    }

    static async getMessages(userTransmitter, receiverId){
            const [messages] = await connetion.query(
                `SELECT 
                    CASE 
                        WHEN messages_transmitter = ? THEN "transmitter"
                        WHEN messages_transmitter = ? THEN "receiver"
                    END AS type ,
                    CASE 
                        WHEN messages_transmitter = 38 THEN u.users_id
                         WHEN messages_receiver = 38 THEN u2.users_id
                    END AS users_id ,
                    CASE 
                        WHEN messages_receiver = 38 THEN u2.users_img
                        WHEN messages_transmitter = 38 THEN u.users_img
                    END AS users_img ,
                    CASE 
                        WHEN messages_receiver = 38 THEN u2.users_last_name
                         WHEN messages_transmitter = 38 THEN u.users_last_name
                    END AS users_last_name ,
                    CASE 
                        WHEN messages_transmitter = 38 THEN u.users_name
                        ELSE u2.users_name
                    END AS users_name, 
                    m.messages_content as message, m.messages_date
                    FROM messages m
                    LEFT JOIN users u
                    ON m.messages_receiver = u.users_id 
                    LEFT JOIN users u2
                    ON m.messages_transmitter = u2.users_id
                    WHERE (messages_transmitter = ? AND messages_receiver = ?) or (messages_transmitter = ? AND messages_receiver = ?)`, 
                    [userTransmitter, receiverId, userTransmitter, receiverId, receiverId, userTransmitter])
        
        return messages
    }

    static async getUserMessages (userLogged, chatUser){
    
        const [userMessages] = await connetion.query(
        `SELECT  SUM(CASE WHEN m.messages_view = 0 AND m.messages_receiver = ? THEN 1 ELSE 0 END)  AS messagesNotViewed,
            MAX(m.messages_date),
            MAX(m.messages_view),
            u.users_id, u.users_img, u.users_name, u.users_last_name
            FROM follow_relation f
            LEFT JOIN users u
            ON  f.follow_relation_followed = u.users_id
            LEFT JOIN messages m
            ON m.messages_transmitter = u.users_id
            WHERE f.follow_relation_follower = ? AND u.users_id != ? 
            GROUP BY u.users_id, u.users_img, u.users_name, u.users_last_name
            ORDER BY MAX(m.messages_date) DESC, MAX(m.messages_view) DESC
            `, 
            [userLogged , userLogged, userLogged])
            
        return userMessages
    }

    static async insertMessage(userTransmitter, userReceiver, message){
        await connetion.query("INSERT INTO messages (messages_transmitter, messages_receiver, messages_content) VALUES (?, ?, ?)",
        [userTransmitter, userReceiver, message])
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
            "INSERT INTO users ( `users_name`, `users_last_name`, `users_email`, `users_password`, `users_bio`, `users_img`) VALUES (?, ?, ?, ?, ?, ?)",
            [...Object.values(credentials)]
        )
    }

    static async editProfile(credentials){
        await connetion.query(
            "UPDATE users SET users_name = ?, users_last_name = ?, users_email = ?, users_password = ?, users_bio = ?, users_img = ? WHERE users_id = ?",
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

     static async getComments(postId){
         
        const [comments] = await connetion.query(`
           SELECT c.comments_id, c.comments_text, c.comments_date, u.users_img, u.users_name, u.users_last_name 
            FROM comments c
            LEFT JOIN users u
            ON c.comments_user_id = u.users_id
            LEFT JOIN posts p
            ON p.posts_id = c.comments_post_id 
            WHERE p.posts_id = ?
            ORDER BY c.comments_id DESC
        `, [postId]
    )
        return comments
    }

    static async insertComment(comment){

        await connetion.query(`
            INSERT INTO comments (comments_post_id,  comments_text, comments_date, comments_user_id) 
            VALUES (?, ?, ?, ?)
            `, [...Object.values(comment)]
        )
    }   

    static async viewMessages(userLogged, userChat){
        
        await connetion.query(`
            UPDATE messages SET messages_view = 1 WHERE (messages_view = 0 AND messages_receiver = ? AND messages_transmitter = ?)
        `, [userLogged, userChat]
    )
    }

    static async chatNotViews(userLogged){
    
        const [chatsQuatity] = await connetion.query(`
            SELECT COUNT(DISTINCT messages_transmitter) AS chatsNotSeen
            FROM  messages
            WHERE messages_view = 0 AND messages_receiver = ?
        `, [userLogged]
    )
        return chatsQuatity
    }
}