import mysql from "mysql2/promise";

const CONFIGURATION = {
  host: "localhost",
  user: "root",
  password: "Contrasena20",
  database: "social-media"
};

const connetion = await mysql.createConnection(CONFIGURATION)

export class Model{

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