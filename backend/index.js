// Code for mongoose config in backend
// Filename - backend/index.js

// To connect with your MongoDB database
const mongoose = require('mongoose');
const path = require('path');

// Use environment variable or fallback to your direct URI
const uri = process.env.MONGODB_URI || "mongodb+srv://zhengzirui43:pmbfINo4tD8cf0O1@cluster0.dsgmo.mongodb.net/";

// Enhanced database connection with better error handling
const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            dbName: 'DoList',
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: "majority",
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        console.log('Connected to DoList database');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

// Ensure database connection before starting server
connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});

// Add mongoose error handlers
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Schema for users of app
const UserSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    completeness: {
        type: String,
        default: "Incomplete",
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
const User = mongoose.model('DoList_item', UserSchema);
User.createIndexes();

// Express app setup
const express = require('express');
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors({
    origin: [
        'https://zirui2333.github.io',
        'http://localhost:3000',
        'https://assignment-5-backend-485d.onrender.com'  // Your Render URL
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

console.log("App listen at port 5000");

// Route to check if backend is working
app.get("/", (req, resp) => {
    resp.send("Backend is Working");
});

// Route to register user
app.post("/register", async (req, resp) => {
    try {
        const user = new User(req.body);
        let result = await user.save();
        resp.send(req.body);
        console.log(result);
    } catch (e) {
        resp.status(500).send("Something Went Wrong");
    }
});

// Route to delete user by ID
app.delete("/delete/:id", async (req, resp) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (result) {
            resp.send({ message: "Task deleted successfully" });
        } else {
            resp.status(404).send({ message: "Task not found" });
        }
    } catch (e) {
        console.error("Error deleting Task:", e);
        resp.status(500).send({ message: "Internal server error" });
    }
});

app.get("/items", async (req, resp) => {
    try {
        const items = await User.find({});
        resp.status(200).send(items);
    } catch (e) {
        console.error("Error fetching items:", e);
        resp.status(500).send({ message: "Internal server error" });
    }
});



app.put('/update/:id', async (req, res) => {
    try {
        const result = await User.findByIdAndUpdate(
            req.params.id,
            {
                task: req.body.task,
                description: req.body.description,
                completeness: req.body.completeness,
                date: req.body.date
            },
            { new: true }
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
});






