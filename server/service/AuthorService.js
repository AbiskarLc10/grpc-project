const grpc = require('@grpc/grpc-js');


class AuthorService {
       
    SignUp = (call,callback) =>{

        try {
            const {name,email,password,genre,date_of_birth} = call.request;

            if(!name || !email || !password || !genre || !date_of_birth){
                return callback({
                    details: "Please provide all fields",
                    statusCode: grpc.status.INVALID_ARGUMENT
                })
            }

        } catch (error) {
            
        }
    }

}

module.exports = AuthorService;