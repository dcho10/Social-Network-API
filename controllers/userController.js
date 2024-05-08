const { User, Thought } = require("../models");

module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
            .populate("friends").populate("thoughts").select("-__v")
            
            if(!user) {
                return res.status(404).json({ message: "No user with ID." })
            }

            res.status(200).json(user);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.status(200).json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            )

            if(!user) {
                return res.status(404).json({ message: "No user with ID."})
            }

            res.status(200).json(user)
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if(!user) {
                return res.status(404).json({ message: "No user exists." });
            } else {
                Thought.deleteMany({ _id: { $in: user.thoughts }})
            }

            res.status(200).json({ message: "User deleted" });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId} },
                { runValidators: true, new: true }
            )

            if(!user) {
                return res.status(404).json({ message: "No user exists." });
            }

            return res.status(200).json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    async deleteFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            )

            if(!user) {
                return res.status(404).json({ message: "No user exists." });
            }

            return res.status(200).json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
}