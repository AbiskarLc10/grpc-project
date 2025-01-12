const DeleteProfile = require("./deleteprofile-author");
const GetAuthorById = require("./getbyid-author");
const GoogleAuthentication = require("./google-auth");
const SignIn = require("./signin-author");
const SignUp = require("./signup-author");
const UpdateProfile = require("./updateprofile-author");

class AuthorService {
  constructor() {}
}

AuthorService.prototype.SignUp = SignUp;
AuthorService.prototype.SignIn = SignIn;
AuthorService.prototype.GetAuthorById = GetAuthorById;
AuthorService.prototype.UpdateProfile = UpdateProfile;
AuthorService.prototype.DeleteProfile = DeleteProfile;
AuthorService.prototype.GoogleAuthentication = GoogleAuthentication;

module.exports = AuthorService;
