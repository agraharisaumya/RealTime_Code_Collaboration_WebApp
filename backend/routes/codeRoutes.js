const express = require('express');
const router = express.Router();
const Code = require('../models/Code');

// ✅ Route to save or update code
router.post('/save', async (req, res) => {
    try {
        const { roomId, username, code } = req.body;

        if (!roomId || !username) {
            return res.status(400).json({ error: 'Missing roomId or username' });
        }

        // Check if an entry exists for this user in the room
        let existingCode = await Code.findOne({ roomId, username });

        if (existingCode) {
            existingCode.code = code;
            await existingCode.save();
        } else {
            existingCode = new Code({ roomId, username, code });
            await existingCode.save();
        }

        res.json({ message: 'Code saved successfully' });
    } catch (error) {
        console.error('Error saving code:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ✅ Route to fetch saved code
router.get('/:roomId/:username', async (req, res) => {
    try {
        const { roomId, username } = req.params;

        const savedCode = await Code.findOne({ roomId, username });

        if (savedCode) {
            res.json({ code: savedCode.code });
        } else {
            res.json({ code: '' }); // Return empty if no code is found
        }
    } catch (error) {
        console.error('Error fetching code:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
