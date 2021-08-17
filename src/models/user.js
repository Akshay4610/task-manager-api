const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid");
      }
    },
    lowercase: true,
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate: (value) => {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Invalid Password");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  avatar: {
      type: Buffer
  }
}, {
    timestamps: true
}
);

userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Email not valid");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid User");
  }
  return user;
};

//In order to bcrypt the password.
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.pre("remove", async function(req, res, next) {
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;
