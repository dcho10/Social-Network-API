const connection = require("../config/connection");
const { User, Thought, Reaction } = require("../models");
const mongoose = require("mongoose")

connection.on("error", (err) => err);

connection.once("open", async () => {
    await User.deleteMany({});
    await User.collection.insertMany(users);
    console.table(users);
    console.log("connected");
    process.exit(0);
})

const users = [
    {
        username: "David",
        email: "david@test.com",
        thoughts: [],
    },
    {
        username: "Test",
        email: "test@test.com",
        thoughts:[],
    }
]

console.log(connection);