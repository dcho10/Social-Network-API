const { Thought, User } = require("../models");

module.exports = {
    async getThoughts (req, res) {
        try {
            const thoughts = await Thought.find();
            res.status(200).json(thoughts);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async getSingleThought (req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
            .select("-__v");

            if (!thought) {
                return res.status(404).json({ message: "No thought with ID" });
            }

            res.status(200).json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            res.json(thought);

            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: _id } },
                { new: true }
            )

            if (!user) {
                res.status(404).json({ message: "No user found"})
            }

            res.status(200).json(thought)
            res.status(200).json(user);

        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },

    async updateThought (req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if(!thought) {
                res.status(404).json({ message: "No thought with this ID" });
            }

            res.status(200).json(course);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async deleteThought (req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

            if (!thought) {
                res.status(404).json({ message: "No thought with this ID" });
            }

            const user = await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            )

            res.status(200).json(thought);
            res.status(200).json(user);

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async createReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate( 
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            )
    
            if(!thought) {
                res.status(404).json({ message : "No thought with this ID "})
            }

            res.status(200).json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndDelete( 
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            )

            if (!thought) {
                res.status(404).json({ message: "No thought with this ID" });
            }

            res.status(200).json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
}