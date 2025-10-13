const express = require('express');
const cors = require('cors');

const app = express();

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
})