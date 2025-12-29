import mysql from "mysql2/promise";

const CONFIGURATION = {
  host: "localhost",
  user: "root",
  password: "Contrasena20",
  database: "social-media"
};

const connetion = await mysql.createConnection(CONFIGURATION)

export class Model{

    static async getMuchUsers (userName){
        
        const [users] = await connetion.query(
            `
                SELECT users_img, users_name, users_last_name
                FROM users
                WHERE users_id != 20 
                AND UPPER(CONCAT(users_name, " ",users_last_name)) like ? 
            `, ["%" +  userName + "%"]
        )

        return users
    }

    static async getSuggestionsUsers (){
        
        const [users] = await connetion.query(
            `
                SELECT users_img, users_name, users_last_name
                FROM users
                WHERE users_id != 20 
            `, []
        )

        return users
    }

     static async getPosts(){

            const [credentials] = await connetion.query(

            `
            SELECT p.posts_description, p.posts_likes, p.posts_img, p.posts_date, u.users_img, u.users_name, u.users_last_name
            FROM posts p
            LEFT JOIN users u
            ON p.posts_user = u.users_id
            `,
            []
        )
        
        return credentials
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
        console.log(credentials);
        
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