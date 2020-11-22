'use strict'

const User=use('App/Models/User');
const Mail = use('Mail');
const Env = use('Env');

class UserController {
    async index({response,request}){
    }

    async register({request,response}){
        const user=new User();
        const data=request.all();
        user.userName=data.userName;
        user.userLastName=data.userLastName;
        user.email=data.email;
        user.password=data.password;
        user.confirmation_password=data.confirmation_password;
        await user.save();
        //return this.login(...arguments); 
        return response.json(user,200);
    }

    async login({ request,response,auth}) {
        const data=request.all();
        const token=await auth.attempt(data.email,data.password);
        const user=await User.findByOrFail('email',data.email);
        if(user){
            const user_data={
                'id':user.id,
                'userName':user.userName,
                'userLastName':user.userLastName,
                'email':user.email,
                'token':token.token,
            }
            return response.json(user_data,200);
        }
        else{
            return response.jason(token,404);
        }
    }

    async show({response,auth}){
        const user =await auth.getUser();
        return response.json(user,200);
    }

    async update({response,request,auth}){
        const user =await auth.getUser(); 
        const data=request.all();
        if(user){
            user.userName=data.userName;
            user.userLastName=data.userLastName;
            user.email=data.email;
            await user.save();
            return response.json(user,200);
        }
        else{
            const message={
                'message':'user not found',
            }
            return response.json(message,404);
        }
        
    }
    async resetPassword({response,request,params}){
        const data=request.all();
        const user=await User.find(params.id);
        if(user){
            user.password=data.password;
            user.confirmation_password=data.confirmation_password;
            await user.save();
            return response.json({message:'ok'},200);
        }
        else{
            const message={
                'message':'user not found',
            }
            return response.json(message,404);
        }
    }

    async destroy({response,params}){
        const user=await User.find(params.id);
        if(user){
            await user.delete();
            return response.json(user,200);
        }
        else{
            const message={
                'message':"user not found",
            }
            return response.json(message,404);
        }
    }

    async emailToRecoverAccount({request,response}){
        const data=request.all();
        const user=await User.findByOrFail('email',data.email);
        if(user){
            await Mail.send('emails.welcome', user.toJSON(), (message) => {
                message
                .to(user.email)
                .from(Env.get('FROM_EMAIL'))
                .subject('Recupera tu cuenta ')
            })
            let message={
                'message':"email send"
            }
            return response.json(message,200);
        }
        else {
            
            return response.json({message:"user email not found"},404); 
        }
       
    

    }
       
}

module.exports = UserController
