import {Schema, model } from 'mongoose';
import * as bcrypt from 'bcrypt-nodejs';
const SALT_WORK_FACTOR     = 10;
const DEFAULT_USER_PICTURE = "/img/user.jpg";

/**
 * Every user has a username, password, socialId, and a picture.
 * If the user registered via username and password(i.e. LocalStrategy),
 *      then socialId should be null.
 * If the user registered via social authenticaton,
 *      then password should be null, and socialId should be assigned to a value.
 * 2. Hash user's password
 *
 */
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: false,
        default : "Guest"
    },
    password: {
        type: String,
        'default': null
    },
    role : { type : String, enum : ["admin", "agent", "user"]},
    picture: {
        type: String,
        'default': DEFAULT_USER_PICTURE
    }
}, {
    timestamps: true
});
/**
 * Before save a user document, Make sure:
 * 1. User's picture is assigned, if not, assign it to default one.
 * 2. Hash user's password
 *
 */
UserSchema.pre('save', function(next) {
    const user = this as any;
    // ensure user picture is set
    if (!user.picture) {
        user.picture = DEFAULT_USER_PICTURE;
    }
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err : Error, salt : string) => {
        if (err) return next(err);
        // hash the password using our new salt
        bcrypt.hash(user.password, salt, () => {}, function(err : Error, hash : string) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

/**
 * Create an Instance method to validate user's password
 * This method will be used to compare the given password with the passwoed stored in the database
 *
 */
UserSchema.methods.validatePassword = function(password : string, callback : (err : Error | null, match ?: boolean)=>void) {
    bcrypt.compare(password, this.password, (err : Error, isMatch : boolean) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};
// Create a user model
const userModel = model('user', UserSchema);
export = userModel;