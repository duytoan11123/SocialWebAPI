const upload = require('../middleware/upload');

exports.uploadImage = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        } else {
            if (req.file == undefined) {
                return res.status(400).json({ message: 'No file selected!' });
            } else {
                // Return the file path (relative or absolute URL)
                // Assuming server is accessed via same host/port logic or constructing it via req.protocol/host
                // Ideally return relative path 'uploads/filename.jpg' and let client prepend base url, 
                // OR return full URL.
                // Let's return full URL based on request if possible, or just the path.
                // Path is safer.

                // Construct full URL for easier use in Flutter
                const protocol = req.protocol;
                const host = req.get('host');
                const fullUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

                res.status(200).json({
                    message: 'File uploaded!',
                    filePath: `uploads/${req.file.filename}`,
                    fullUrl: fullUrl
                });
            }
        }
    });
};
